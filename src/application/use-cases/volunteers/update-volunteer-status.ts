import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerApplication } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type UpdateVolunteerApplicationStatusInput,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class UpdateVolunteerStatusUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(
    id: string,
    input: UpdateVolunteerApplicationStatusInput,
  ): Promise<VolunteerApplication> {
    return this.volunteerRepository.updateApplicationStatus(id, input);
  }
}
