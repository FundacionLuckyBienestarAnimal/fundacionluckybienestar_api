import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_REPOSITORY,
  type MediaRepositoryPort,
} from '../../../domain/ports/output/media-repository';

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.mediaRepository.delete(id);
  }
}
