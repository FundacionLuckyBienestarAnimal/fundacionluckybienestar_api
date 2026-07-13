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
import { CreateHousingTypeDto } from '../../../application/dto/adoptions/create-housing-type';
import { UpdateAdoptionStatusDto } from '../../../application/dto/adoptions/update-adoption-status';
import { UpdateHousingTypeDto } from '../../../application/dto/adoptions/update-housing-type';
import { CreateHousingTypeUseCase } from '../../../application/use-cases/adoptions/create-housing-type';
import { DeleteHousingTypeUseCase } from '../../../application/use-cases/adoptions/delete-housing-type';
import { GetAdminAdoptionApplicationsUseCase } from '../../../application/use-cases/adoptions/get-admin-adoption-applications';
import { GetAdminHousingTypesUseCase } from '../../../application/use-cases/adoptions/get-admin-housing-types';
import { UpdateAdoptionStatusUseCase } from '../../../application/use-cases/adoptions/update-adoption-status';
import { UpdateHousingTypeUseCase } from '../../../application/use-cases/adoptions/update-housing-type';
import type {
  AdoptionApplication,
  HousingType,
} from '../../../domain/models/adoptions/adoption';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/adoptions')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('adoptions.manage')
export class AdminAdoptionsController {
  constructor(
    private readonly getAdminHousingTypesUseCase: GetAdminHousingTypesUseCase,
    private readonly createHousingTypeUseCase: CreateHousingTypeUseCase,
    private readonly updateHousingTypeUseCase: UpdateHousingTypeUseCase,
    private readonly deleteHousingTypeUseCase: DeleteHousingTypeUseCase,
    private readonly getAdminAdoptionApplicationsUseCase: GetAdminAdoptionApplicationsUseCase,
    private readonly updateAdoptionStatusUseCase: UpdateAdoptionStatusUseCase,
  ) {}

  @Get('housing-types')
  getHousingTypes(): Promise<HousingType[]> {
    return this.getAdminHousingTypesUseCase.execute();
  }

  @Post('housing-types')
  createHousingType(@Body() body: CreateHousingTypeDto): Promise<HousingType> {
    return this.createHousingTypeUseCase.execute(body);
  }

  @Patch('housing-types/:id')
  updateHousingType(
    @Param('id') id: string,
    @Body() body: UpdateHousingTypeDto,
  ): Promise<HousingType> {
    return this.updateHousingTypeUseCase.execute(id, body);
  }

  @Delete('housing-types/:id')
  @HttpCode(204)
  deleteHousingType(@Param('id') id: string): Promise<void> {
    return this.deleteHousingTypeUseCase.execute(id);
  }

  @Get('applications')
  getApplications(): Promise<AdoptionApplication[]> {
    return this.getAdminAdoptionApplicationsUseCase.execute();
  }

  @Patch('applications/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateAdoptionStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AdoptionApplication> {
    return this.updateAdoptionStatusUseCase.execute(id, {
      ...body,
      changedBy: user.id,
    });
  }
}
