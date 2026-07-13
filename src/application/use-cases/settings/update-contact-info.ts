import { Inject, Injectable } from '@nestjs/common';
import type { ContactInfo } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
  type UpdateContactInfoInput,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class UpdateContactInfoUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(id: string, input: UpdateContactInfoInput): Promise<ContactInfo> {
    return this.settingsRepository.updateContactInfo(id, input);
  }
}
