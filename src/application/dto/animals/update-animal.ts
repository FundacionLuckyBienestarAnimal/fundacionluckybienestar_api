import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type {
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../../domain/models/animals/animal';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsIn(['dog', 'cat', 'other'])
  species?: AnimalSpecies;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sex?: AnimalSex;

  @IsOptional()
  @IsIn(['small', 'medium', 'large'])
  size?: AnimalSize;

  @IsOptional()
  @IsString()
  ageLabel?: string;

  @IsOptional()
  @IsIn(['available', 'in_process', 'sponsored', 'adopted', 'hidden'])
  status?: AnimalStatus;

  @IsOptional()
  @IsBoolean()
  isSterilized?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
