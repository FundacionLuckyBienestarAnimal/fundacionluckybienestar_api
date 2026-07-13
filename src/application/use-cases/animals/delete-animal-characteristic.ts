import { Inject, Injectable } from '@nestjs/common';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class DeleteAnimalCharacteristicUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(animalId: string, characteristicId: string): Promise<void> {
    return this.animalRepository.deleteCharacteristic(
      animalId,
      characteristicId,
    );
  }
}
