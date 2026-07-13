import { Inject, Injectable } from '@nestjs/common';
import type { HeroCard } from '../../../domain/models/landing/hero-card';
import {
  LANDING_REPOSITORY,
  type LandingRepositoryPort,
  type UpdateHeroCardInput,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class UpdateHeroCardUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(id: string, input: UpdateHeroCardInput): Promise<HeroCard> {
    return this.landingRepository.updateHeroCard(id, input);
  }
}
