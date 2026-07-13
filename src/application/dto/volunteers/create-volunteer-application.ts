import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import type { VolunteerAvailabilityType } from '../../../domain/models/volunteers/volunteer';

export class CreateVolunteerApplicationDto {
  @IsString()
  motivation: string;

  @IsIn(['weekdays', 'weekends', 'both'])
  availabilityType: VolunteerAvailabilityType;

  @IsOptional()
  @IsBoolean()
  isAdultConfirmed?: boolean;
}
