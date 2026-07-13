import { Inject, Injectable } from '@nestjs/common';
import type { VolunteerApplication } from '../../../domain/models/volunteers/volunteer';
import {
  VOLUNTEER_REPOSITORY,
  type CreateVolunteerApplicationInput,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class CreateVolunteerApplicationUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(
    input: CreateVolunteerApplicationInput,
  ): Promise<VolunteerApplication> {
    return this.volunteerRepository.createApplication(input);
  }
}
