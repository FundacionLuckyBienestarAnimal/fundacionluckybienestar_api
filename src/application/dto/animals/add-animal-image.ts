import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

export class AddAnimalImageDto {
  @IsUUID()
  mediaId: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
