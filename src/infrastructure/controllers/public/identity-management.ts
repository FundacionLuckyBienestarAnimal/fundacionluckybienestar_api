import { Controller, Get } from '@nestjs/common';
import {
  GetPublicAvatarsUseCase,
  GetPublicBadgesUseCase,
} from '../../../application/use-cases/identity-management/identity-management';
import type {
  AvatarOption,
  Badge,
} from '../../../domain/models/access-control/identity-management';

@Controller('public')
export class PublicIdentityManagementController {
  constructor(
    private readonly getPublicAvatarsUseCase: GetPublicAvatarsUseCase,
    private readonly getPublicBadgesUseCase: GetPublicBadgesUseCase,
  ) {}

  @Get('avatar-options')
  getAvatars(): Promise<AvatarOption[]> {
    return this.getPublicAvatarsUseCase.execute();
  }

  @Get('badges')
  getBadges(): Promise<Badge[]> {
    return this.getPublicBadgesUseCase.execute();
  }
}
