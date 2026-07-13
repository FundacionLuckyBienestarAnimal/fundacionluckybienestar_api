import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdoptionApplicationDto {
  @IsUUID()
  animalId: string;

  @IsUUID()
  housingTypeId: string;

  @IsOptional()
  @IsString()
  housingOtherDetail?: string;

  @IsString()
  adoptionReason: string;
}
