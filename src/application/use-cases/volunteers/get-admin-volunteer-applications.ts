import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerApplication } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class GetAdminVolunteerApplicationsUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(): Promise<VolunteerApplication[]> {
    return this.volunteerRepository.findAdminApplications();
  }
}
