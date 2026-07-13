import { Inject, Injectable } from '@nestjs/common';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class DeleteAnimalUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.animalRepository.deleteAnimal(id);
  }
}
