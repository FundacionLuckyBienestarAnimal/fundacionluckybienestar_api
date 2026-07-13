import { Inject, Injectable } from '@nestjs/common';
import type { HousingType } from '../../../domain/models/adoptions/adoption';
import {
  ADOPTION_REPOSITORY,
  type AdoptionRepositoryPort,
} from '../../../domain/ports/output/adoption-repository';

@Injectable()
export class GetAdminHousingTypesUseCase {
  constructor(
    @Inject(ADOPTION_REPOSITORY)
    private readonly adoptionRepository: AdoptionRepositoryPort,
  ) {}

  execute(): Promise<HousingType[]> {
    return this.adoptionRepository.findAdminHousingTypes();
  }
}
