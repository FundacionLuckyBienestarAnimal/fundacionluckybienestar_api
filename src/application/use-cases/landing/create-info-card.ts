import { Inject, Injectable } from '@nestjs/common';
import type { LandingInfoCard } from '../../../domain/models/landing/landing-info-card';
import {
  LANDING_REPOSITORY,
  type CreateLandingInfoCardInput,
  type LandingRepositoryPort,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class CreateLandingInfoCardUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(input: CreateLandingInfoCardInput): Promise<LandingInfoCard> {
    return this.landingRepository.createInfoCard(input);
  }
}
