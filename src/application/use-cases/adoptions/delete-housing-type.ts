import { Inject, Injectable } from '@nestjs/common';
import {
  ADOPTION_REPOSITORY,
  type AdoptionRepositoryPort,
} from '../../../domain/ports/output/adoption-repository';

@Injectable()
export class DeleteHousingTypeUseCase {
  constructor(
    @Inject(ADOPTION_REPOSITORY)
    private readonly adoptionRepository: AdoptionRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.adoptionRepository.deleteHousingType(id);
  }
}
