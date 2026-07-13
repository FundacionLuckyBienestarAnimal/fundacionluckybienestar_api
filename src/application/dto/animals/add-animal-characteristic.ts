import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class AddAnimalCharacteristicDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
