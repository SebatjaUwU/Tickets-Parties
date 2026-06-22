import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class EventFiltersDto {
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() genre?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsIn(['ASC', 'DESC']) order?: 'ASC' | 'DESC';
}
