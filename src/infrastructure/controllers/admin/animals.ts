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
import { AddAnimalCharacteristicDto } from '../../../application/dto/animals/add-animal-characteristic';
import { AddAnimalImageDto } from '../../../application/dto/animals/add-animal-image';
import { CreateAnimalDto } from '../../../application/dto/animals/create-animal';
import { UpdateAnimalCharacteristicDto } from '../../../application/dto/animals/update-animal-characteristic';
import { UpdateAnimalDto } from '../../../application/dto/animals/update-animal';
import { AddAnimalCharacteristicUseCase } from '../../../application/use-cases/animals/add-animal-characteristic';
import { AddAnimalImageUseCase } from '../../../application/use-cases/animals/add-animal-image';
import { CreateAnimalUseCase } from '../../../application/use-cases/animals/create-animal';
import { DeleteAnimalCharacteristicUseCase } from '../../../application/use-cases/animals/delete-animal-characteristic';
import { DeleteAnimalImageUseCase } from '../../../application/use-cases/animals/delete-animal-image';
import { DeleteAnimalUseCase } from '../../../application/use-cases/animals/delete-animal';
import { GetAdminAnimalsUseCase } from '../../../application/use-cases/animals/get-admin-animals';
import { UpdateAnimalCharacteristicUseCase } from '../../../application/use-cases/animals/update-animal-characteristic';
import { UpdateAnimalUseCase } from '../../../application/use-cases/animals/update-animal';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type {
  Animal,
  AnimalCharacteristic,
  AnimalImage,
} from '../../../domain/models/animals/animal';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/animals')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('animals.manage')
export class AdminAnimalsController {
  constructor(
    private readonly getAdminAnimalsUseCase: GetAdminAnimalsUseCase,
    private readonly createAnimalUseCase: CreateAnimalUseCase,
    private readonly updateAnimalUseCase: UpdateAnimalUseCase,
    private readonly deleteAnimalUseCase: DeleteAnimalUseCase,
    private readonly addAnimalImageUseCase: AddAnimalImageUseCase,
    private readonly deleteAnimalImageUseCase: DeleteAnimalImageUseCase,
    private readonly addAnimalCharacteristicUseCase: AddAnimalCharacteristicUseCase,
    private readonly updateAnimalCharacteristicUseCase: UpdateAnimalCharacteristicUseCase,
    private readonly deleteAnimalCharacteristicUseCase: DeleteAnimalCharacteristicUseCase,
  ) {}

  @Get()
  getAnimals(): Promise<Animal[]> {
    return this.getAdminAnimalsUseCase.execute();
  }

  @Post()
  createAnimal(
    @Body() body: CreateAnimalDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Animal> {
    return this.createAnimalUseCase.execute({
      ...body,
      createdBy: user.id,
    });
  }

  @Patch(':id')
  updateAnimal(
    @Param('id') id: string,
    @Body() body: UpdateAnimalDto,
  ): Promise<Animal> {
    return this.updateAnimalUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAnimal(@Param('id') id: string): Promise<void> {
    return this.deleteAnimalUseCase.execute(id);
  }

  @Post(':id/images')
  addImage(
    @Param('id') animalId: string,
    @Body() body: AddAnimalImageDto,
  ): Promise<AnimalImage> {
    return this.addAnimalImageUseCase.execute(animalId, body);
  }

  @Delete(':id/images/:imageId')
  @HttpCode(204)
  deleteImage(
    @Param('id') animalId: string,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    return this.deleteAnimalImageUseCase.execute(animalId, imageId);
  }

  @Post(':id/characteristics')
  addCharacteristic(
    @Param('id') animalId: string,
    @Body() body: AddAnimalCharacteristicDto,
  ): Promise<AnimalCharacteristic> {
    return this.addAnimalCharacteristicUseCase.execute(animalId, body);
  }

  @Patch(':id/characteristics/:characteristicId')
  updateCharacteristic(
    @Param('id') animalId: string,
    @Param('characteristicId') characteristicId: string,
    @Body() body: UpdateAnimalCharacteristicDto,
  ): Promise<AnimalCharacteristic> {
    return this.updateAnimalCharacteristicUseCase.execute(
      animalId,
      characteristicId,
      body,
    );
  }

  @Delete(':id/characteristics/:characteristicId')
  @HttpCode(204)
  deleteCharacteristic(
    @Param('id') animalId: string,
    @Param('characteristicId') characteristicId: string,
  ): Promise<void> {
    return this.deleteAnimalCharacteristicUseCase.execute(
      animalId,
      characteristicId,
    );
  }
}
