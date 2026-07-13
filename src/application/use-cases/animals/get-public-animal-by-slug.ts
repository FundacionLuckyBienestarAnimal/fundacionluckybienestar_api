import { Inject, Injectable } from '@nestjs/common';
import type { Animal } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class GetPublicAnimalBySlugUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(slug: string): Promise<Animal> {
    return this.animalRepository.findPublicAnimalBySlug(slug);
  }
}
