import { IsIn, IsOptional, IsString } from 'class-validator';
import type { MediaType } from '../../../domain/models/media/media-asset';

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsIn(['image', 'video', 'document', 'other'])
  mediaType?: MediaType;

  @IsOptional()
  @IsString()
  folder?: string;
}
