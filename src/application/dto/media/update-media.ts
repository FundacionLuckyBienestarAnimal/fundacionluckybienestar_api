import { IsIn, IsOptional, IsString } from 'class-validator';
import type { MediaType } from '../../../domain/models/media/media-asset';

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsIn(['image', 'video', 'document', 'other'])
  mediaType?: MediaType;
}
