import { Inject, Injectable } from '@nestjs/common';
import type { SocialLink } from '../../../domain/models/settings/public-settings';
import {
  SETTINGS_REPOSITORY,
  type SettingsRepositoryPort,
} from '../../../domain/ports/output/settings-repository';

@Injectable()
export class GetAdminSocialLinksUseCase {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepositoryPort,
  ) {}

  execute(): Promise<SocialLink[]> {
    return this.settingsRepository.findAdminSocialLinks();
  }
}
