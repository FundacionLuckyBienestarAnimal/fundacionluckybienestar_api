import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerRequirement } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class GetPublicVolunteerRequirementsUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(): Promise<VolunteerRequirement[]> {
    return this.volunteerRepository.findPublicRequirements();
  }
}
