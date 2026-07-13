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
import { CreateHeroCardDto } from '../../../application/dto/landing/create-hero-card';
import { CreateLandingImpactBlockDto } from '../../../application/dto/landing/create-impact-block';
import { CreateLandingInfoCardDto } from '../../../application/dto/landing/create-info-card';
import { CreateLandingSectionDto } from '../../../application/dto/landing/create-section';
import { UpdateHeroCardDto } from '../../../application/dto/landing/update-hero-card';
import { UpdateLandingImpactBlockDto } from '../../../application/dto/landing/update-impact-block';
import { UpdateLandingInfoCardDto } from '../../../application/dto/landing/update-info-card';
import { UpdateLandingSectionDto } from '../../../application/dto/landing/update-section';
import { CreateHeroCardUseCase } from '../../../application/use-cases/landing/create-hero-card';
import { CreateLandingImpactBlockUseCase } from '../../../application/use-cases/landing/create-impact-block';
import { CreateLandingInfoCardUseCase } from '../../../application/use-cases/landing/create-info-card';
import { CreateLandingSectionUseCase } from '../../../application/use-cases/landing/create-section';
import { DeleteHeroCardUseCase } from '../../../application/use-cases/landing/delete-hero-card';
import { DeleteLandingImpactBlockUseCase } from '../../../application/use-cases/landing/delete-impact-block';
import { DeleteLandingInfoCardUseCase } from '../../../application/use-cases/landing/delete-info-card';
import { DeleteLandingSectionUseCase } from '../../../application/use-cases/landing/delete-section';
import { GetAdminLandingUseCase } from '../../../application/use-cases/landing/get-admin-landing';
import { UpdateHeroCardUseCase } from '../../../application/use-cases/landing/update-hero-card';
import { UpdateLandingImpactBlockUseCase } from '../../../application/use-cases/landing/update-impact-block';
import { UpdateLandingInfoCardUseCase } from '../../../application/use-cases/landing/update-info-card';
import { UpdateLandingSectionUseCase } from '../../../application/use-cases/landing/update-section';
import type { HeroCard } from '../../../domain/models/landing/hero-card';
import type { LandingImpactBlock } from '../../../domain/models/landing/landing-impact-block';
import type { LandingInfoCard } from '../../../domain/models/landing/landing-info-card';
import type {
  LandingSection,
  LandingSectionDetail,
} from '../../../domain/models/landing/landing-section';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/landing')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('content.manage')
export class AdminLandingController {
  constructor(
    private readonly getAdminLandingUseCase: GetAdminLandingUseCase,
    private readonly createLandingSectionUseCase: CreateLandingSectionUseCase,
    private readonly createHeroCardUseCase: CreateHeroCardUseCase,
    private readonly createImpactBlockUseCase: CreateLandingImpactBlockUseCase,
    private readonly createInfoCardUseCase: CreateLandingInfoCardUseCase,
    private readonly updateLandingSectionUseCase: UpdateLandingSectionUseCase,
    private readonly updateHeroCardUseCase: UpdateHeroCardUseCase,
    private readonly updateImpactBlockUseCase: UpdateLandingImpactBlockUseCase,
    private readonly updateInfoCardUseCase: UpdateLandingInfoCardUseCase,
    private readonly deleteLandingSectionUseCase: DeleteLandingSectionUseCase,
    private readonly deleteHeroCardUseCase: DeleteHeroCardUseCase,
    private readonly deleteImpactBlockUseCase: DeleteLandingImpactBlockUseCase,
    private readonly deleteInfoCardUseCase: DeleteLandingInfoCardUseCase,
  ) {}

  @Get()
  getLanding(): Promise<LandingSectionDetail[]> {
    return this.getAdminLandingUseCase.execute();
  }

  @Post('sections')
  createSection(
    @Body() body: CreateLandingSectionDto,
  ): Promise<LandingSection> {
    return this.createLandingSectionUseCase.execute(body);
  }

  @Post('hero-cards')
  createHeroCard(@Body() body: CreateHeroCardDto): Promise<HeroCard> {
    return this.createHeroCardUseCase.execute(body);
  }

  @Post('impact-blocks')
  createImpactBlock(
    @Body() body: CreateLandingImpactBlockDto,
  ): Promise<LandingImpactBlock> {
    return this.createImpactBlockUseCase.execute(body);
  }

  @Post('info-cards')
  createInfoCard(
    @Body() body: CreateLandingInfoCardDto,
  ): Promise<LandingInfoCard> {
    return this.createInfoCardUseCase.execute(body);
  }

  @Patch('sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() body: UpdateLandingSectionDto,
  ): Promise<LandingSection> {
    return this.updateLandingSectionUseCase.execute(id, body);
  }

  @Patch('hero-cards/:id')
  updateHeroCard(
    @Param('id') id: string,
    @Body() body: UpdateHeroCardDto,
  ): Promise<HeroCard> {
    return this.updateHeroCardUseCase.execute(id, body);
  }

  @Patch('impact-blocks/:id')
  updateImpactBlock(
    @Param('id') id: string,
    @Body() body: UpdateLandingImpactBlockDto,
  ): Promise<LandingImpactBlock> {
    return this.updateImpactBlockUseCase.execute(id, body);
  }

  @Patch('info-cards/:id')
  updateInfoCard(
    @Param('id') id: string,
    @Body() body: UpdateLandingInfoCardDto,
  ): Promise<LandingInfoCard> {
    return this.updateInfoCardUseCase.execute(id, body);
  }

  @Delete('sections/:id')
  @HttpCode(204)
  deleteSection(@Param('id') id: string): Promise<void> {
    return this.deleteLandingSectionUseCase.execute(id);
  }

  @Delete('hero-cards/:id')
  @HttpCode(204)
  deleteHeroCard(@Param('id') id: string): Promise<void> {
    return this.deleteHeroCardUseCase.execute(id);
  }

  @Delete('impact-blocks/:id')
  @HttpCode(204)
  deleteImpactBlock(@Param('id') id: string): Promise<void> {
    return this.deleteImpactBlockUseCase.execute(id);
  }

  @Delete('info-cards/:id')
  @HttpCode(204)
  deleteInfoCard(@Param('id') id: string): Promise<void> {
    return this.deleteInfoCardUseCase.execute(id);
  }
}
