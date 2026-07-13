import { Inject, Injectable } from '@nestjs/common';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class DeleteFaqItemUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.settingsRepository.deleteFaqItem(id);
  }
}
