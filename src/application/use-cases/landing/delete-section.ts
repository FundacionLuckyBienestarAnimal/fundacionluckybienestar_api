import { Inject, Injectable } from '@nestjs/common';
import {
  LANDING_REPOSITORY,
  type LandingRepositoryPort,
} from '../../../domain/ports/output/landing-repository';

@Injectable()
export class DeleteLandingSectionUseCase {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.landingRepository.deleteSection(id);
  }
}
