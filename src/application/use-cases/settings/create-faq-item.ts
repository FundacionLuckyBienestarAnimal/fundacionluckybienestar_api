import { Inject, Injectable } from '@nestjs/common';
import type { FaqItem } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type CreateFaqItemInput,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class CreateFaqItemUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(input: CreateFaqItemInput): Promise<FaqItem> {
    return this.settingsRepository.createFaqItem(input);
  }
}
