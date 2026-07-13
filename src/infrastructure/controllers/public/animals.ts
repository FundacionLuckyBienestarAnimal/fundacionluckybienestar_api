import { Controller, Get, Param } from '@nestjs/common';
import { GetPublicAnimalBySlugUseCase } from '../../../application/use-cases/animals/get-public-animal-by-slug';
import { GetPublicAnimalsUseCase } from '../../../application/use-cases/animals/get-public-animals';
import type { Animal } from '../../../domain/models/animals/animal';

@Controller('public/animals')
export class PublicAnimalsController {
  constructor(
    private readonly getPublicAnimalsUseCase: GetPublicAnimalsUseCase,
    private readonly getPublicAnimalBySlugUseCase: GetPublicAnimalBySlugUseCase,
  ) {}

  @Get()
  getAnimals(): Promise<Animal[]> {
    return this.getPublicAnimalsUseCase.execute();
  }

  @Get(':slug')
  getAnimalBySlug(@Param('slug') slug: string): Promise<Animal> {
    return this.getPublicAnimalBySlugUseCase.execute(slug);
  }
}
