import { Inject, Injectable } from '@nestjs/common';
import type { Publication } from '../../../domain/models/publications/publication';
import {
  PUBLICATION_REPOSITORY,
  type PublicationRepositoryPort,
  type UpdatePublicationInput,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class UpdatePublicationUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(id: string, input: UpdatePublicationInput): Promise<Publication> {
    return this.publicationRepository.updatePublication(id, input);
  }
}
