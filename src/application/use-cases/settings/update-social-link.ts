import { Inject, Injectable } from '@nestjs/common';
import type { SocialLink } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
  type UpdateSocialLinkInput,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class UpdateSocialLinkUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(id: string, input: UpdateSocialLinkInput): Promise<SocialLink> {
    return this.settingsRepository.updateSocialLink(id, input);
  }
}
