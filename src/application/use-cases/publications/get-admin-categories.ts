import { Inject, Injectable } from '@nestjs/common';
import type { PublicationCategory } from '../../../domain/models/publications/publication-category';
import {
  PUBLICATION_REPOSITORY,
  type PublicationRepositoryPort,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class GetAdminPublicationCategoriesUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(): Promise<PublicationCategory[]> {
    return this.publicationRepository.findAdminCategories();
  }
}
