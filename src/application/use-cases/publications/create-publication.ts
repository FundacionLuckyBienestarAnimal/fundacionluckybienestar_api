import { Inject, Injectable } from '@nestjs/common';
import type { Publication } from '../../../domain/models/publications/publication';
import {
  PUBLICATION_REPOSITORY,
  type CreatePublicationInput,
  type PublicationRepositoryPort,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class CreatePublicationUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(input: CreatePublicationInput): Promise<Publication> {
    return this.publicationRepository.createPublication(input);
  }
}
