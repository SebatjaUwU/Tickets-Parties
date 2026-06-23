import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) firstName: string;
  @IsString() @MinLength(2) lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @Matches(/^\d{6,12}$/, { message: 'Cédula inválida (solo números, 6-12 dígitos)' }) cedula: string;
  @IsString() @Matches(/^\+?\d{7,15}$/, { message: 'Número de celular inválido' }) phone: string;
  @IsString() @IsOptional() referralCode?: string;
}
