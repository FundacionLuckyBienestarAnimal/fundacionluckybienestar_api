import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAnimalCharacteristicDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
