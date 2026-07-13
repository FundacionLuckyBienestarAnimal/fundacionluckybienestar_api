import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateLandingImpactBlockDto {
  @IsOptional()
  @IsString()
  prefixText?: string;

  @IsOptional()
  @IsInt()
  metricValue?: number;

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
