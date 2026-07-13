import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHeroCardDto {
  @IsOptional()
  @IsString()
  title?: string;

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
