import { Inject, Injectable } from '@nestjs/common';
import type { SocialLink } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type CreateSocialLinkInput,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class CreateSocialLinkUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(input: CreateSocialLinkInput): Promise<SocialLink> {
    return this.settingsRepository.createSocialLink(input);
  }
}
