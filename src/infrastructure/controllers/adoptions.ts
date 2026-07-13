import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateAdoptionApplicationDto } from '../../application/dto/adoptions/create-adoption-application';
import { CreateAdoptionApplicationUseCase } from '../../application/use-cases/adoptions/create-adoption-application';
import { GetMyAdoptionApplicationsUseCase } from '../../application/use-cases/adoptions/get-my-adoption-applications';
import type { AdoptionApplication } from '../../domain/models/adoptions/adoption';
import type { AuthenticatedUser } from '../../domain/models/auth/authenticated-user';
import { CurrentUser } from '../http/auth/decorators/current-user';
import { Permissions } from '../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../http/auth/guards/supabase-auth';

@Controller('adoptions')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
export class AdoptionsController {
  constructor(
    private readonly createAdoptionApplicationUseCase: CreateAdoptionApplicationUseCase,
    private readonly getMyAdoptionApplicationsUseCase: GetMyAdoptionApplicationsUseCase,
  ) {}

  @Post('applications')
  @Permissions('adoption.apply')
  createApplication(
    @Body() body: CreateAdoptionApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AdoptionApplication> {
    return this.createAdoptionApplicationUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get('applications/me')
  @Permissions('adoption.apply')
  getMyApplications(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AdoptionApplication[]> {
    return this.getMyAdoptionApplicationsUseCase.execute(user.id);
  }
}
