import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerApplication } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class GetMyVolunteerApplicationsUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(userId: string): Promise<VolunteerApplication[]> {
    return this.volunteerRepository.findMyApplications(userId);
  }
}
