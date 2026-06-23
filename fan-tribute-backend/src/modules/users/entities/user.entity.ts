import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

export enum UserRole { SUPER_ADMIN = 'super_admin', ADMIN = 'admin', ORGANIZER = 'organizer', CLIENT = 'client' }
export enum UserStatus { ACTIVE = 'active', INACTIVE = 'inactive', BANNED = 'banned', PENDING_VERIFICATION = 'pending_verification' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column({ nullable: true }) username: string;
  @Column({ nullable: true }) passwordHash: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) cedula: string;
  @Column({ nullable: true }) avatarUrl: string;
  @Column({ nullable: true }) bio: string;
  @Column({ nullable: true }) country: string;
  @Column({ nullable: true }) city: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT }) role: UserRole;
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION }) status: UserStatus;
  @Column({ default: false }) emailVerified: boolean;
  @Column({ default: false }) twoFaEnabled: boolean;
  @Column({ nullable: true }) twoFaSecret: string;
  @Column({ default: 0, type: 'int' }) points: number;
  @Column({ default: 0, type: 'decimal', precision: 12, scale: 2 }) totalSpent: number;
  @Column({ nullable: true, unique: true }) referralCode: string;
  @Column({ nullable: true }) googleId: string;
  @Column({ nullable: true }) firebaseUid: string;
  @ManyToOne(() => User, { nullable: true }) referredBy?: User;
  @Column({ nullable: true }) lastLoginAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  get fullName(): string { return `${this.firstName} ${this.lastName}`; }
}
