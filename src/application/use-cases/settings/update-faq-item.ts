import { Inject, Injectable } from '@nestjs/common';
import type { FaqItem } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
  type UpdateFaqItemInput,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class UpdateFaqItemUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(id: string, input: UpdateFaqItemInput): Promise<FaqItem> {
    return this.settingsRepository.updateFaqItem(id, input);
  }
}
