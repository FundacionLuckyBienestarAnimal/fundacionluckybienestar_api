import { Controller, Get } from '@nestjs/common';
import { GetPublicVolunteerRequirementsUseCase } from '../../../application/use-cases/volunteers/get-public-requirements';
import type { VolunteerRequirement } from '../../../domain/models/volunteers/volunteer';

@Controller('public/volunteers')
export class PublicVolunteersController {
  constructor(
    private readonly getPublicRequirementsUseCase: GetPublicVolunteerRequirementsUseCase,
  ) {}

  @Get('requirements')
  getRequirements(): Promise<VolunteerRequirement[]> {
    return this.getPublicRequirementsUseCase.execute();
  }
}
