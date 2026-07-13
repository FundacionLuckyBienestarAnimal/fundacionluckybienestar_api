import { Controller, Get } from '@nestjs/common';
import { GetPublicLandingUseCase } from '../../../application/use-cases/landing/get-public-landing';
import type { LandingSectionDetail } from '../../../domain/models/landing/landing-section';

@Controller('public/landing')
export class PublicLandingController {
  constructor(
    private readonly getPublicLandingUseCase: GetPublicLandingUseCase,
  ) {}

  @Get()
  getLanding(): Promise<LandingSectionDetail[]> {
    return this.getPublicLandingUseCase.execute();
  }
}
