import { Inject, Injectable } from '@nestjs/common';
import {
  VOLUNTEER_REPOSITORY,
  type VolunteerRepositoryPort,
} from '../../../domain/ports/output/volunteer-repository';

@Injectable()
export class DeleteVolunteerRequirementUseCase {
  constructor(
    @Inject(VOLUNTEER_REPOSITORY)
    private readonly volunteerRepository: VolunteerRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.volunteerRepository.deleteRequirement(id);
  }
}
