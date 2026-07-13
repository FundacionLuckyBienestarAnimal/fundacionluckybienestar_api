import { Inject, Injectable } from '@nestjs/common';
import {
  PUBLICATION_REPOSITORY,
  type PublicationRepositoryPort,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class DeletePublicationUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.publicationRepository.deletePublication(id);
  }
}
