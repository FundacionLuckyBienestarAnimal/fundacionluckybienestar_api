import { Controller, Get, Param } from '@nestjs/common';
import { GetPublicPublicationCategoriesUseCase } from '../../../application/use-cases/publications/get-public-categories';
import { GetPublicPublicationBySlugUseCase } from '../../../application/use-cases/publications/get-public-publication-by-slug';
import { GetPublicPublicationsUseCase } from '../../../application/use-cases/publications/get-public-publications';
import type { Publication } from '../../../domain/models/publications/publication';
import type { PublicationCategory } from '../../../domain/models/publications/publication-category';

@Controller('public')
export class PublicPublicationsController {
  constructor(
    private readonly getPublicCategoriesUseCase: GetPublicPublicationCategoriesUseCase,
    private readonly getPublicPublicationsUseCase: GetPublicPublicationsUseCase,
    private readonly getPublicPublicationBySlugUseCase: GetPublicPublicationBySlugUseCase,
  ) {}

  @Get('publication-categories')
  getCategories(): Promise<PublicationCategory[]> {
    return this.getPublicCategoriesUseCase.execute();
  }

  @Get('publications')
  getPublications(): Promise<Publication[]> {
    return this.getPublicPublicationsUseCase.execute();
  }

  @Get('publications/:slug')
  getPublicationBySlug(@Param('slug') slug: string): Promise<Publication> {
    return this.getPublicPublicationBySlugUseCase.execute(slug);
  }
}
