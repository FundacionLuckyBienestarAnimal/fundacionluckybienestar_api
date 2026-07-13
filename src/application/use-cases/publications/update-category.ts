import { Inject, Injectable } from '@nestjs/common';
import type { PublicationCategory } from '../../../domain/models/publications/publication-category';
import {
  PUBLICATION_REPOSITORY,
  type PublicationRepositoryPort,
  type UpdatePublicationCategoryInput,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class UpdatePublicationCategoryUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdatePublicationCategoryInput,
  ): Promise<PublicationCategory> {
    return this.publicationRepository.updateCategory(id, input);
  }
}
