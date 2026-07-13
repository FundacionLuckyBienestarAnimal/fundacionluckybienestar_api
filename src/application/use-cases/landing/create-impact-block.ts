import { Inject, Injectable } from '@nestjs/common';
import type { LandingImpactBlock } from '../../../domain/models/landing/landing-impact-block';
import {
  LANDING_REPOSITORY,
  type CreateLandingImpactBlockInput,
  type LandingRepositoryPort,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class CreateLandingImpactBlockUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(input: CreateLandingImpactBlockInput): Promise<LandingImpactBlock> {
    return this.landingRepository.createImpactBlock(input);
  }
}
