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
import { CreatePublicationCategoryDto } from '../../../application/dto/publications/create-category';
import { CreatePublicationDto } from '../../../application/dto/publications/create-publication';
import { UpdatePublicationCategoryDto } from '../../../application/dto/publications/update-category';
import { UpdatePublicationDto } from '../../../application/dto/publications/update-publication';
import { CreatePublicationCategoryUseCase } from '../../../application/use-cases/publications/create-category';
import { CreatePublicationUseCase } from '../../../application/use-cases/publications/create-publication';
import { DeletePublicationCategoryUseCase } from '../../../application/use-cases/publications/delete-category';
import { DeletePublicationUseCase } from '../../../application/use-cases/publications/delete-publication';
import { GetAdminPublicationCategoriesUseCase } from '../../../application/use-cases/publications/get-admin-categories';
import { GetAdminPublicationsUseCase } from '../../../application/use-cases/publications/get-admin-publications';
import { UpdatePublicationCategoryUseCase } from '../../../application/use-cases/publications/update-category';
import { UpdatePublicationUseCase } from '../../../application/use-cases/publications/update-publication';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type { Publication } from '../../../domain/models/publications/publication';
import type { PublicationCategory } from '../../../domain/models/publications/publication-category';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('content.manage')
export class AdminPublicationsController {
  constructor(
    private readonly getAdminCategoriesUseCase: GetAdminPublicationCategoriesUseCase,
    private readonly createCategoryUseCase: CreatePublicationCategoryUseCase,
    private readonly updateCategoryUseCase: UpdatePublicationCategoryUseCase,
    private readonly deleteCategoryUseCase: DeletePublicationCategoryUseCase,
    private readonly getAdminPublicationsUseCase: GetAdminPublicationsUseCase,
    private readonly createPublicationUseCase: CreatePublicationUseCase,
    private readonly updatePublicationUseCase: UpdatePublicationUseCase,
    private readonly deletePublicationUseCase: DeletePublicationUseCase,
  ) {}

  @Get('publication-categories')
  getCategories(): Promise<PublicationCategory[]> {
    return this.getAdminCategoriesUseCase.execute();
  }

  @Post('publication-categories')
  createCategory(
    @Body() body: CreatePublicationCategoryDto,
  ): Promise<PublicationCategory> {
    return this.createCategoryUseCase.execute(body);
  }

  @Patch('publication-categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdatePublicationCategoryDto,
  ): Promise<PublicationCategory> {
    return this.updateCategoryUseCase.execute(id, body);
  }

  @Delete('publication-categories/:id')
  @HttpCode(204)
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.deleteCategoryUseCase.execute(id);
  }

  @Get('publications')
  getPublications(): Promise<Publication[]> {
    return this.getAdminPublicationsUseCase.execute();
  }

  @Post('publications')
  createPublication(
    @Body() body: CreatePublicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Publication> {
    return this.createPublicationUseCase.execute({
      ...body,
      createdBy: user.id,
    });
  }

  @Patch('publications/:id')
  updatePublication(
    @Param('id') id: string,
    @Body() body: UpdatePublicationDto,
  ): Promise<Publication> {
    return this.updatePublicationUseCase.execute(id, body);
  }

  @Delete('publications/:id')
  @HttpCode(204)
  deletePublication(@Param('id') id: string): Promise<void> {
    return this.deletePublicationUseCase.execute(id);
  }
}
