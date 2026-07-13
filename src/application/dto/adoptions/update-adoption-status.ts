import { IsIn, IsOptional, IsString } from 'class-validator';
import type { AdoptionStatus } from '../../../domain/models/adoptions/adoption';

export class UpdateAdoptionStatusDto {
  @IsIn([
    'submitted',
    'under_review',
    'in_process',
    'completed',
    'rejected',
    'cancelled',
  ])
  status: AdoptionStatus;

  @IsOptional()
  @IsString()
  reviewMessage?: string;
}
