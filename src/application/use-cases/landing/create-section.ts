import { Inject, Injectable } from '@nestjs/common';
import type { LandingSection } from '../../../domain/models/landing/landing-section';
import {
  LANDING_REPOSITORY,
  type CreateLandingSectionInput,
  type LandingRepositoryPort,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class CreateLandingSectionUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(input: CreateLandingSectionInput): Promise<LandingSection> {
    return this.landingRepository.createSection(input);
  }
}
