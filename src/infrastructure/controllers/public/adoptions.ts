import { Controller, Get } from '@nestjs/common';
import { GetPublicHousingTypesUseCase } from '../../../application/use-cases/adoptions/get-public-housing-types';
import type { HousingType } from '../../../domain/models/adoptions/adoption';

@Controller('public/adoptions')
export class PublicAdoptionsController {
  constructor(
    private readonly getPublicHousingTypesUseCase: GetPublicHousingTypesUseCase,
  ) {}

  @Get('housing-types')
  getHousingTypes(): Promise<HousingType[]> {
    return this.getPublicHousingTypesUseCase.execute();
  }
}
