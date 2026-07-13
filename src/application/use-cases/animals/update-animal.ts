import { Inject, Injectable } from '@nestjs/common';
import type { Animal } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
  type UpdateAnimalInput,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class UpdateAnimalUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(id: string, input: UpdateAnimalInput): Promise<Animal> {
    return this.animalRepository.updateAnimal(id, input);
  }
}
