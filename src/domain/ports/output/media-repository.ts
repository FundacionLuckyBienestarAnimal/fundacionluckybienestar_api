import type { MediaAsset, MediaType } from '../../models/media/media-asset';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface UploadMediaInput {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  altText?: string;
  mediaType?: MediaType;
  folder?: string;
  uploadedBy: string;
}

export interface UpdateMediaInput {
  altText?: string;
  mediaType?: MediaType;
}

export interface MediaRepositoryPort {
  findAll(): Promise<MediaAsset[]>;
  upload(input: UploadMediaInput): Promise<MediaAsset>;
  update(id: string, input: UpdateMediaInput): Promise<MediaAsset>;
  delete(id: string): Promise<void>;
}
