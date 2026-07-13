import { Inject, Injectable } from '@nestjs/common';
import type { ContactInfo } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class GetPublicContactInfoUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(): Promise<ContactInfo[]> {
    return this.settingsRepository.findPublicContactInfo();
  }
}
