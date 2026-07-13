import { Inject, Injectable } from '@nestjs/common';
import type { Animal } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class GetPublicAnimalsUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(): Promise<Animal[]> {
    return this.animalRepository.findPublicAnimals();
  }
}
