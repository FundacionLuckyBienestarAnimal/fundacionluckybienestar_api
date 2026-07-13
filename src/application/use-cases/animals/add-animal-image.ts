import { Inject, Injectable } from '@nestjs/common';
import type { AnimalImage } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AddAnimalImageInput,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class AddAnimalImageUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(animalId: string, input: AddAnimalImageInput): Promise<AnimalImage> {
    return this.animalRepository.addImage(animalId, input);
  }
}
