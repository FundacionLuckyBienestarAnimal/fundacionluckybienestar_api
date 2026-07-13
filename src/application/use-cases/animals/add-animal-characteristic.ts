import { Inject, Injectable } from '@nestjs/common';
import type { AnimalCharacteristic } from '../../../domain/models/animals/animal';
import {
  ANIMAL_REPOSITORY,
  type AddAnimalCharacteristicInput,
  type AnimalRepositoryPort,
} from '../../../domain/ports/output/animal-repository';

@Injectable()
export class AddAnimalCharacteristicUseCase {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private readonly animalRepository: AnimalRepositoryPort,
  ) {}

  execute(
    animalId: string,
    input: AddAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic> {
    return this.animalRepository.addCharacteristic(animalId, input);
  }
}
