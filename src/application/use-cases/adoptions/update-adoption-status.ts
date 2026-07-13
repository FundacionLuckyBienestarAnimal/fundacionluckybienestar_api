import { Inject, Injectable } from '@nestjs/common';
import type { AdoptionApplication } from '../../../domain/models/adoptions/adoption';
import {
  ADOPTION_REPOSITORY,
  type AdoptionRepositoryPort,
  type UpdateAdoptionStatusInput,
} from '../../../domain/ports/output/adoption-repository';

@Injectable()
export class UpdateAdoptionStatusUseCase {
  constructor(
    @Inject(ADOPTION_REPOSITORY)
    private readonly adoptionRepository: AdoptionRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateAdoptionStatusInput,
  ): Promise<AdoptionApplication> {
    return this.adoptionRepository.updateApplicationStatus(id, input);
  }
}
