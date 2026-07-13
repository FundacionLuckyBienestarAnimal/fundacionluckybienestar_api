import { Inject, Injectable } from '@nestjs/common';
import type { MediaAsset } from '../../../domain/models/media/media-asset';
import {
  MEDIA_REPOSITORY,
  type MediaRepositoryPort,
  type UpdateMediaInput,
} from '../../../domain/ports/output/media-repository';

@Injectable()
export class UpdateMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  execute(id: string, input: UpdateMediaInput): Promise<MediaAsset> {
    return this.mediaRepository.update(id, input);
  }
}
