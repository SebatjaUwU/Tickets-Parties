import { IsString, IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString() title: string;
  @IsString() @IsOptional() description?: string;
  @IsDateString() date: string;
  @IsDateString() @IsOptional() endDate?: string;
  @IsString() @IsOptional() genre?: string;
  @IsString() @IsOptional() venue?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() country?: string;
  @IsInt() @Min(0) @IsOptional() @Type(() => Number) capacity?: number;
}
