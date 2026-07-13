import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerProfile } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class GetVolunteerProfilesUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(): Promise<VolunteerProfile[]> {
    return this.volunteerRepository.findProfiles();
  }
}
