import { Inject, Injectable } from '@nestjs/common';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class DeleteAnimalImageUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(animalId: string, imageId: string): Promise<void> {
    return this.animalRepository.deleteImage(animalId, imageId);
  }
}
