import { Inject, Injectable } from '@nestjs/common';
import type { MediaAsset } from '../../../domain/models/media/media-asset';
import {
  MEDIA_REPOSITORY,
  type MediaRepositoryPort,
  type UploadMediaInput,
} from '../../../domain/ports/output/media-repository';

@Injectable()
export class UploadMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  execute(input: UploadMediaInput): Promise<MediaAsset> {
    return this.mediaRepository.upload(input);
  }
}
