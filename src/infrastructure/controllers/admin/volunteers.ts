import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateVolunteerRequirementDto } from '../../../application/dto/volunteers/create-requirement';
import { UpdateVolunteerRequirementDto } from '../../../application/dto/volunteers/update-requirement';
import { UpdateVolunteerStatusDto } from '../../../application/dto/volunteers/update-volunteer-status';
import { CreateVolunteerRequirementUseCase } from '../../../application/use-cases/volunteers/create-requirement';
import { DeleteVolunteerRequirementUseCase } from '../../../application/use-cases/volunteers/delete-requirement';
import { GetAdminVolunteerApplicationsUseCase } from '../../../application/use-cases/volunteers/get-admin-volunteer-applications';
import { GetAdminVolunteerRequirementsUseCase } from '../../../application/use-cases/volunteers/get-admin-requirements';
import { GetVolunteerProfilesUseCase } from '../../../application/use-cases/volunteers/get-volunteer-profiles';
import { UpdateVolunteerRequirementUseCase } from '../../../application/use-cases/volunteers/update-requirement';
import { UpdateVolunteerStatusUseCase } from '../../../application/use-cases/volunteers/update-volunteer-status';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type {
  VolunteerApplication,
  VolunteerProfile,
  VolunteerRequirement,
} from '../../../domain/models/volunteers/volunteer';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/volunteers')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('volunteers.manage')
export class AdminVolunteersController {
  constructor(
    private readonly getAdminRequirementsUseCase: GetAdminVolunteerRequirementsUseCase,
    private readonly createRequirementUseCase: CreateVolunteerRequirementUseCase,
    private readonly updateRequirementUseCase: UpdateVolunteerRequirementUseCase,
    private readonly deleteRequirementUseCase: DeleteVolunteerRequirementUseCase,
    private readonly getAdminApplicationsUseCase: GetAdminVolunteerApplicationsUseCase,
    private readonly updateVolunteerStatusUseCase: UpdateVolunteerStatusUseCase,
    private readonly getVolunteerProfilesUseCase: GetVolunteerProfilesUseCase,
  ) {}

  @Get('requirements')
  getRequirements(): Promise<VolunteerRequirement[]> {
    return this.getAdminRequirementsUseCase.execute();
  }

  @Post('requirements')
  createRequirement(
    @Body() body: CreateVolunteerRequirementDto,
  ): Promise<VolunteerRequirement> {
    return this.createRequirementUseCase.execute(body);
  }

  @Patch('requirements/:id')
  updateRequirement(
    @Param('id') id: string,
    @Body() body: UpdateVolunteerRequirementDto,
  ): Promise<VolunteerRequirement> {
    return this.updateRequirementUseCase.execute(id, body);
  }

  @Delete('requirements/:id')
  @HttpCode(204)
  deleteRequirement(@Param('id') id: string): Promise<void> {
    return this.deleteRequirementUseCase.execute(id);
  }

  @Get('applications')
  getApplications(): Promise<VolunteerApplication[]> {
    return this.getAdminApplicationsUseCase.execute();
  }

  @Patch('applications/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateVolunteerStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<VolunteerApplication> {
    return this.updateVolunteerStatusUseCase.execute(id, {
      ...body,
      changedBy: user.id,
    });
  }

  @Get('profiles')
  getProfiles(): Promise<VolunteerProfile[]> {
    return this.getVolunteerProfilesUseCase.execute();
  }
}
