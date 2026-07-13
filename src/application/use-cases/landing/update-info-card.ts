import { Inject, Injectable } from '@nestjs/common';
import type { LandingInfoCard } from '../../../domain/models/landing/landing-info-card';
import {
  LANDING_REPOSITORY,
  type LandingRepositoryPort,
  type UpdateLandingInfoCardInput,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class UpdateLandingInfoCardUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateLandingInfoCardInput,
  ): Promise<LandingInfoCard> {
    return this.landingRepository.updateInfoCard(id, input);
  }
}
