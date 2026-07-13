import { Inject, Injectable } from '@nestjs/common';
import type { ContactInfo } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type CreateContactInfoInput,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class CreateContactInfoUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(input: CreateContactInfoInput): Promise<ContactInfo> {
    return this.settingsRepository.createContactInfo(input);
  }
}
