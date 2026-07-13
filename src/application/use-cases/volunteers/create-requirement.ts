import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerRequirement } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type CreateVolunteerRequirementInput,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class CreateVolunteerRequirementUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(
    input: CreateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement> {
    return this.volunteerRepository.createRequirement(input);
  }
}
