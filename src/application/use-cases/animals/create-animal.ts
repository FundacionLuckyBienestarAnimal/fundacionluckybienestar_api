import { Inject, Injectable } from '@nestjs/common';
import type { Animal } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
  type CreateAnimalInput,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class CreateAnimalUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(input: CreateAnimalInput): Promise<Animal> {
    return this.animalRepository.createAnimal(input);
  }
}
