import { Inject, Injectable } from '@nestjs/common';
import type { LandingSection } from '../../../domain/models/landing/landing-section';
import {
  LANDING_REPOSITORY,
  type LandingRepositoryPort,
  type UpdateLandingSectionInput,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class UpdateLandingSectionUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateLandingSectionInput,
  ): Promise<LandingSection> {
    return this.landingRepository.updateSection(id, input);
  }
}
