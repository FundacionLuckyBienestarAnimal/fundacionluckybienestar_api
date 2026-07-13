import { Inject, Injectable } from '@nestjs/common';
import type { HousingType } from '../../../domain/models/adoptions/adoption';
import {
  ADOPTION_REPOSITORY,
  type AdoptionRepositoryPort,
  type CreateHousingTypeInput,
} from '../../../domain/ports/output/adoption-repository';

@Injectable()
export class CreateHousingTypeUseCase {
  constructor(
    @Inject(ADOPTION_REPOSITORY)
    private readonly adoptionRepository: AdoptionRepositoryPort,
  ) {}

  execute(input: CreateHousingTypeInput): Promise<HousingType> {
    return this.adoptionRepository.createHousingType(input);
  }
}
