import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsDateString() startDate: string;
  @IsDateString() endDate: string;
  @IsString() @IsOptional() venueId?: string;
}
