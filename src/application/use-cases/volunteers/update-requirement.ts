import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerRequirement } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type UpdateVolunteerRequirementInput,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class UpdateVolunteerRequirementUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement> {
    return this.volunteerRepository.updateRequirement(id, input);
  }
}
