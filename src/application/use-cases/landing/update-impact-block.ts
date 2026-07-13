import { Inject, Injectable } from '@nestjs/common';
import type { LandingImpactBlock } from '../../../domain/models/landing/landing-impact-block';
import {
  LANDING_REPOSITORY,
  type LandingRepositoryPort,
  type UpdateLandingImpactBlockInput,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class UpdateLandingImpactBlockUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateLandingImpactBlockInput,
  ): Promise<LandingImpactBlock> {
    return this.landingRepository.updateImpactBlock(id, input);
  }
}
