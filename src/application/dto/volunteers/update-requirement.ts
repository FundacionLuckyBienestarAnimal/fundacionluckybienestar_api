import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type { VolunteerRequirementType } from '../../../domain/models/volunteers/volunteer';

export class UpdateVolunteerRequirementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['material', 'schedule', 'condition', 'other'])
  type?: VolunteerRequirementType;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
