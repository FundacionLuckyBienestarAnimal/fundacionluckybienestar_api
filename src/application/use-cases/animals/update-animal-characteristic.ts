import { Inject, Injectable } from '@nestjs/common';
import type { AnimalCharacteristic } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepositoryPort,
  type UpdateAnimalCharacteristicInput,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class UpdateAnimalCharacteristicUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(
    animalId: string,
    characteristicId: string,
    input: UpdateAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic> {
    return this.animalRepository.updateCharacteristic(
      animalId,
      characteristicId,
      input,
    );
  }
}
