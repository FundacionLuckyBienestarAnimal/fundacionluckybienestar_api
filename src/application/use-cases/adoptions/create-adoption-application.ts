import { Inject, Injectable } from '@nestjs/common';
import type { AdoptionApplication } from '../../../domain/models/adoptions/adoption';
import {
  ADOPTION_REPOSITORY,
  type AdoptionRepositoryPort,
  type CreateAdoptionApplicationInput,
} from '../../../domain/ports/output/adoption-repository';

@Injectable()
export class CreateAdoptionApplicationUseCase {
  constructor(
    @Inject(ADOPTION_REPOSITORY)
    private readonly adoptionRepository: AdoptionRepositoryPort,
  ) {}

  execute(input: CreateAdoptionApplicationInput): Promise<AdoptionApplication> {
    return this.adoptionRepository.createApplication(input);
  }
}
