import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLandingImpactBlockDto {
  @IsUUID()
  sectionId: string;

  @IsOptional()
  @IsString()
  prefixText?: string;

  @IsInt()
  metricValue: number;

  @IsOptional()
  @IsString()
  suffixText?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  ctaHref?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
