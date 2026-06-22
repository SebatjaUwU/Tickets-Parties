import {
  Controller, Post, Body, Req, UseGuards, Get, Patch, HttpCode, HttpStatus, Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.register(dto, ip);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Inicio de sesión' })
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login con Google OAuth' })
  async googleLogin(@Body('idToken') idToken: string, @Ip() ip: string) {
    return this.authService.googleAuth(idToken, ip);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async logout(@CurrentUser() user: any, @Body('refreshToken') refreshToken: string) {
    await this.authService.logout(user.id, refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Solicitar reset de contraseña' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmail(@Body('token') token: string) {
    await this.authService.verifyEmail(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar autenticación de dos factores' })
  async enable2FA(@CurrentUser() user: any) {
    return this.authService.enable2FA(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async verify2FA(@CurrentUser() user: any, @Body() dto: Verify2FADto) {
    await this.authService.verify2FA(user.id, dto.token);
  }
}
