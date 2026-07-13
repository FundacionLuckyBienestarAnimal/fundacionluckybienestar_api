import { Inject, Injectable } from '@nestjs/common';
import type { Publication } from '../../../domain/models/publications/publication';
import {
  PUBLICATION_REPOSITORY,
  type PublicationRepositoryPort,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class GetPublicPublicationBySlugUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(slug: string): Promise<Publication> {
    return this.publicationRepository.findPublicPublicationBySlug(slug);
  }
}
