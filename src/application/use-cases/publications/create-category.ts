import { Inject, Injectable } from '@nestjs/common';
import type { PublicationCategory } from '../../../domain/models/publications/publication-category';
import {
  PUBLICATION_REPOSITORY,
  type CreatePublicationCategoryInput,
  type PublicationRepositoryPort,
} from '../../../domain/ports/output/publication-repository';

@Injectable()
export class CreatePublicationCategoryUseCase {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: PublicationRepositoryPort,
  ) {}

  execute(input: CreatePublicationCategoryInput): Promise<PublicationCategory> {
    return this.publicationRepository.createCategory(input);
  }
}
