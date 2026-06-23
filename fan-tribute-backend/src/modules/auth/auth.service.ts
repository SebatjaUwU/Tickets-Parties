import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as speakeasy from 'speakeasy';

import { User, UserStatus } from '../users/entities/user.entity';
import { UserSession } from '../users/entities/user-session.entity';
import { PasswordReset } from '../users/entities/password-reset.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: Partial<User>;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserSession) private readonly sessionRepo: Repository<UserSession>,
    @InjectRepository(PasswordReset) private readonly resetRepo: Repository<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto, ipAddress?: string): Promise<AuthTokens> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El correo electrónico ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const referralCode = await this.generateReferralCode();

    let referredBy: User | null = null;
    if (dto.referralCode) {
      referredBy = await this.userRepo.findOne({ where: { referralCode: dto.referralCode } });
    }

    const user = this.userRepo.create({
      ...dto,
      passwordHash,
      referralCode,
      referredBy: referredBy ?? undefined,
    });

    await this.userRepo.save(user);

    // Generate short-lived JWT for email verification (24h)
    const verificationToken = this.jwtService.sign(
      { sub: user.id, type: 'email-verify' },
      { secret: this.config.get<string>('JWT_SECRET'), expiresIn: '24h' },
    );
    await this.notificationsService.sendVerificationEmail(user, verificationToken);

    // Award referral points
    if (referredBy) {
      await this.usersService.addPoints(referredBy.id, 100, 'referral', `Referido: ${user.email}`);
    }

    return this.generateTokens(user, ipAddress);
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'passwordHash', 'firstName', 'lastName', 'role', 'status', 'emailVerified', 'twoFaEnabled'],
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    if (user.status === 'banned') throw new UnauthorizedException('Cuenta suspendida');

    // Update last login
    await this.userRepo.update(user.id, { lastLoginAt: new Date() });

    return this.generateTokens(user, ipAddress, userAgent);
  }

  async googleAuth(idToken: string, ipAddress?: string): Promise<AuthTokens> {
    const { FirebaseAdminService } = await import('../auth/firebase-admin.service');
    // Verify Google token via Firebase
    const decoded = await this.verifyFirebaseToken(idToken);

    let user = await this.userRepo.findOne({ where: { email: decoded.email } });

    if (!user) {
      // Auto-register new user from Google
      const referralCode = await this.generateReferralCode();
      user = this.userRepo.create({
        email: decoded.email!,
        firstName: decoded.name?.split(' ')[0] ?? 'User',
        lastName: decoded.name?.split(' ').slice(1).join(' ') ?? '',
        avatarUrl: decoded.picture,
        googleId: decoded.uid,
        firebaseUid: decoded.uid,
        emailVerified: true,
        status: UserStatus.ACTIVE,
        referralCode,
      });
      await this.userRepo.save(user);
    } else {
      await this.userRepo.update(user.id, {
        googleId: decoded.uid,
        firebaseUid: decoded.uid,
        lastLoginAt: new Date(),
      });
    }

    return this.generateTokens(user, ipAddress);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const session = await this.sessionRepo.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.sessionRepo.delete(session.id);
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    return this.generateTokens(session.user);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.sessionRepo.delete({ user: { id: userId }, refreshToken });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return; // Security: don't reveal if email exists

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.resetRepo.save(this.resetRepo.create({ user, token, expiresAt }));
    await this.notificationsService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await this.resetRepo.findOne({
      where: { token, used: false },
      relations: ['user'],
    });

    if (!reset || reset.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(reset.user.id, { passwordHash });
    await this.resetRepo.update(reset.id, { used: true });

    // Invalidate all sessions
    await this.sessionRepo.delete({ user: { id: reset.user.id } });
    await this.notificationsService.sendPasswordChangedEmail(reset.user);
  }

  async verifyEmail(token: string): Promise<void> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new BadRequestException('Token de verificación inválido o expirado');
    }
    if (payload.type !== 'email-verify') {
      throw new BadRequestException('Token inválido');
    }
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.emailVerified) return; // ya verificado, no hacer nada
    await this.userRepo.update(user.id, { emailVerified: true, status: UserStatus.ACTIVE });
  }

  async enable2FA(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    const secret = speakeasy.generateSecret({ name: `FanTribute:${user.email}`, issuer: 'FanTribute' });

    await this.userRepo.update(userId, { twoFaSecret: secret.base32 });

    const qrCode = await import('qrcode').then(m => m.toDataURL(secret.otpauth_url!));
    return { secret: secret.base32, qrCode };
  }

  async verify2FA(userId: string, token: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'twoFaSecret'],
    });

    if (!user?.twoFaSecret) throw new BadRequestException('2FA no configurado');

    const valid = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!valid) throw new UnauthorizedException('Código 2FA inválido');
    await this.userRepo.update(userId, { twoFaEnabled: true });
  }

  private async generateTokens(user: Partial<User>, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.sessionRepo.save(this.sessionRepo.create({
      user: { id: user.id } as User,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    }));

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user: this.sanitizeUser(user as User),
    };
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, twoFaSecret, ...rest } = user as any;
    return rest;
  }

  private async generateReferralCode(): Promise<string> {
    let code: string;
    let exists: User | null;
    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await this.userRepo.findOne({ where: { referralCode: code } });
    } while (exists);
    return code;
  }

  private async verifyFirebaseToken(idToken: string): Promise<any> {
    const admin = await import('firebase-admin');
    return admin.default.auth().verifyIdToken(idToken);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'firstName', 'lastName', 'role', 'status'],
    });
    if (!user || !user.passwordHash) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }
}
