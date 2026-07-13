import { Inject, Injectable } from '@nestjs/common';
import type { HeroCard } from '../../../domain/models/landing/hero-card';
import {
  LANDING_REPOSITORY,
  type CreateHeroCardInput,
  type LandingRepositoryPort,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class CreateHeroCardUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(input: CreateHeroCardInput): Promise<HeroCard> {
    return this.landingRepository.createHeroCard(input);
  }
}
