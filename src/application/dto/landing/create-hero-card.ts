import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateHeroCardDto {
  @IsUUID()
  sectionId: string;

  @IsString()
  title: string;

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
