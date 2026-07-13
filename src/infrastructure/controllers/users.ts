import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UpdateProfileDto } from '../../application/dto/users/update-profile';
import { GetMyProfileUseCase } from '../../application/use-cases/users/get-my-profile';
import { UpdateMyProfileUseCase } from '../../application/use-cases/users/update-my-profile';
import type { AuthenticatedUser } from '../../domain/models/auth/authenticated-user';
import type { Profile } from '../../domain/models/users/profile';
import { CurrentUser } from '../http/auth/decorators/current-user';
import { SupabaseAuthGuard } from '../http/auth/guards/supabase-auth';

@Controller('users/me/profile')
@UseGuards(SupabaseAuthGuard)
export class UsersController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateMyProfileUseCase: UpdateMyProfileUseCase,
  ) {}

  @Get()
  getProfile(@CurrentUser() user: AuthenticatedUser): Promise<Profile> {
    return this.getMyProfileUseCase.execute(user.id);
  }

  @Patch()
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateProfileDto,
  ): Promise<Profile> {
    return this.updateMyProfileUseCase.execute(user.id, body);
  }
}
