import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateVolunteerApplicationDto } from '../../application/dto/volunteers/create-volunteer-application';
import { CreateVolunteerApplicationUseCase } from '../../application/use-cases/volunteers/create-volunteer-application';
import { GetMyVolunteerApplicationsUseCase } from '../../application/use-cases/volunteers/get-my-volunteer-applications';
import type { AuthenticatedUser } from '../../domain/models/auth/authenticated-user';
import type { VolunteerApplication } from '../../domain/models/volunteers/volunteer';
import { CurrentUser } from '../http/auth/decorators/current-user';
import { Permissions } from '../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../http/auth/guards/supabase-auth';

@Controller('volunteers')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
export class VolunteersController {
  constructor(
    private readonly createVolunteerApplicationUseCase: CreateVolunteerApplicationUseCase,
    private readonly getMyVolunteerApplicationsUseCase: GetMyVolunteerApplicationsUseCase,
  ) {}

  @Post('applications')
  @Permissions('volunteer.apply')
  createApplication(
    @Body() body: CreateVolunteerApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VolunteerApplication> {
    return this.createVolunteerApplicationUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get('applications/me')
  @Permissions('volunteer.apply')
  getMyApplications(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VolunteerApplication[]> {
    return this.getMyVolunteerApplicationsUseCase.execute(user.id);
  }
}
