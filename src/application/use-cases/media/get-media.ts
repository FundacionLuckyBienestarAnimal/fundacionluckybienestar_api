import { Inject, Injectable } from '@nestjs/common';
import type { MediaAsset } from '../../../domain/models/media/media-asset';
import {
  MEDIA_REPOSITORY,
  type MediaRepositoryPort,
} from '../../../domain/ports/output/media-repository';

@Injectable()
export class GetMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  execute(): Promise<MediaAsset[]> {
    return this.mediaRepository.findAll();
  }
}
