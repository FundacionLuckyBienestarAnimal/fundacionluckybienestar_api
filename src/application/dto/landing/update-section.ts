import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateLandingSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  highlightedText?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsUUID()
  mainMediaId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
