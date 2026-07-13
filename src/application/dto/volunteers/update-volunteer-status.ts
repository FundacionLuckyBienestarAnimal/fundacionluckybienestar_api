import { IsIn, IsOptional, IsString } from 'class-validator';
import type { VolunteerApplicationStatus } from '../../../domain/models/volunteers/volunteer';

export class UpdateVolunteerStatusDto {
  @IsIn(['submitted', 'under_review', 'approved', 'rejected', 'cancelled'])
  status: VolunteerApplicationStatus;

  @IsOptional()
  @IsString()
  reviewMessage?: string;
}
