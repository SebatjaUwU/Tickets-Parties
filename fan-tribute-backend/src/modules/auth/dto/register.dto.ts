import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString() @MinLength(2) firstName: string;
  @IsString() @MinLength(2) lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() referralCode?: string;
}
