import { Inject, Injectable } from '@nestjs/common';
import type { FaqItem } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class GetAdminFaqItemsUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(): Promise<FaqItem[]> {
    return this.settingsRepository.findAdminFaqItems();
  }
}
