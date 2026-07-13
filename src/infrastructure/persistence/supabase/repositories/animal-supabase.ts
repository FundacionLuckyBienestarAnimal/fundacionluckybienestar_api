import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Animal,
  AnimalCharacteristic,
  AnimalImage,
} from '../../../../domain/models/animals/animal';
import type { MediaAsset } from '../../../../domain/models/media/media-asset';
import type {
  AddAnimalCharacteristicInput,
  AddAnimalImageInput,
  AnimalRepositoryPort,
  CreateAnimalInput,
  UpdateAnimalCharacteristicInput,
  UpdateAnimalInput,
} from '../../../../domain/ports/output/animal-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  AnimalCharacteristicRow,
  AnimalImageRow,
  AnimalProfileRow,
  MediaAssetRow,
} from '../types/bdd-supabase';

@Injectable()
export class AnimalSupabaseRepository implements AnimalRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findPublicAnimals(): Promise<Animal[]> {
    const animals = await this.findAnimals(true);
    return this.attachDetails(animals, true);
  }

  async findAdminAnimals(): Promise<Animal[]> {
    const animals = await this.findAnimals(false);
    return this.attachDetails(animals, false);
  }

  async findPublicAnimalBySlug(slug: string): Promise<Animal> {
    const { data, error } = await this.supabase
      .from('animal_profiles')
      .select(this.animalSelect)
      .eq('slug', slug)
      .eq('is_active', true)
      .neq('status', 'hidden')
      .is('deleted_at', null)
      .single<AnimalProfileRow>();

    if (error) {
      throw new NotFoundException('Animal not found');
    }

    const [animal] = await this.attachDetails([this.toAnimal(data)], true);
    return animal;
  }

  async createAnimal(input: CreateAnimalInput): Promise<Animal> {
    const { data, error } = await this.supabase
      .from('animal_profiles')
      .insert({
        created_by: input.createdBy,
        name: input.name,
        slug: input.slug,
        species: input.species,
        sex: input.sex,
        size: input.size,
        age_label: input.ageLabel,
        status: input.status,
        is_sterilized: input.isSterilized,
        description: input.description,
        is_featured: input.isFeatured,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.animalSelect)
      .single<AnimalProfileRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toAnimal(data);
  }

  async updateAnimal(id: string, input: UpdateAnimalInput): Promise<Animal> {
    const { data, error } = await this.supabase
      .from('animal_profiles')
      .update({
        name: input.name,
        slug: input.slug,
        species: input.species,
        sex: input.sex,
        size: input.size,
        age_label: input.ageLabel,
        status: input.status,
        is_sterilized: input.isSterilized,
        description: input.description,
        is_featured: input.isFeatured,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.animalSelect)
      .single<AnimalProfileRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toAnimal(data);
  }

  deleteAnimal(id: string): Promise<void> {
    return this.softDelete('animal_profiles', id);
  }

  async addImage(
    animalId: string,
    input: AddAnimalImageInput,
  ): Promise<AnimalImage> {
    const { data, error } = await this.supabase
      .from('animal_images')
      .insert({
        animal_id: animalId,
        media_id: input.mediaId,
        is_primary: input.isPrimary,
        order_index: input.orderIndex,
      })
      .select(this.imageSelect)
      .single<AnimalImageRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toImage(data);
  }

  deleteImage(animalId: string, imageId: string): Promise<void> {
    return this.softDelete('animal_images', imageId, animalId);
  }

  async addCharacteristic(
    animalId: string,
    input: AddAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic> {
    const { data, error } = await this.supabase
      .from('animal_characteristics')
      .insert({
        animal_id: animalId,
        label: input.label,
        order_index: input.orderIndex,
        is_active: input.isActive,
      })
      .select(this.characteristicSelect)
      .single<AnimalCharacteristicRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toCharacteristic(data);
  }

  async updateCharacteristic(
    animalId: string,
    characteristicId: string,
    input: UpdateAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic> {
    const { data, error } = await this.supabase
      .from('animal_characteristics')
      .update({
        label: input.label,
        order_index: input.orderIndex,
        is_active: input.isActive,
      })
      .eq('id', characteristicId)
      .eq('animal_id', animalId)
      .is('deleted_at', null)
      .select(this.characteristicSelect)
      .single<AnimalCharacteristicRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toCharacteristic(data);
  }

  deleteCharacteristic(
    animalId: string,
    characteristicId: string,
  ): Promise<void> {
    return this.softDelete(
      'animal_characteristics',
      characteristicId,
      animalId,
    );
  }

  private async findAnimals(publicOnly: boolean): Promise<Animal[]> {
    let query = this.supabase
      .from('animal_profiles')
      .select(this.animalSelect)
      .is('deleted_at', null);

    if (publicOnly) {
      query = query.eq('is_active', true).neq('status', 'hidden');
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<AnimalProfileRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toAnimal(row));
  }

  private async attachDetails(
    animals: Animal[],
    publicOnly: boolean,
  ): Promise<Animal[]> {
    if (animals.length === 0) {
      return [];
    }

    const animalIds = animals.map((animal) => animal.id);
    const [images, characteristics] = await Promise.all([
      this.findImages(animalIds),
      this.findCharacteristics(animalIds, publicOnly),
    ]);

    return animals.map((animal) => ({
      ...animal,
      images: images.filter((image) => image.animalId === animal.id),
      characteristics: characteristics.filter(
        (item) => item.animalId === animal.id,
      ),
    }));
  }

  private async findImages(animalIds: string[]): Promise<AnimalImage[]> {
    const { data, error } = await this.supabase
      .from('animal_images')
      .select(this.imageSelect)
      .in('animal_id', animalIds)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<AnimalImageRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toImage(row));
  }

  private async findCharacteristics(
    animalIds: string[],
    publicOnly: boolean,
  ): Promise<AnimalCharacteristic[]> {
    let query = this.supabase
      .from('animal_characteristics')
      .select(this.characteristicSelect)
      .in('animal_id', animalIds)
      .is('deleted_at', null);

    if (publicOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<AnimalCharacteristicRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toCharacteristic(row));
  }

  private toAnimal(row: AnimalProfileRow): Animal {
    return {
      id: row.id,
      createdBy: row.created_by,
      name: row.name,
      slug: row.slug,
      species: row.species,
      sex: row.sex,
      size: row.size,
      ageLabel: row.age_label,
      status: row.status,
      isSterilized: row.is_sterilized,
      description: row.description,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toImage(row: AnimalImageRow): AnimalImage {
    return {
      id: row.id,
      animalId: row.animal_id,
      mediaId: row.media_id,
      isPrimary: row.is_primary,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      media: row.media_assets ? this.toMedia(row.media_assets) : null,
    };
  }

  private toCharacteristic(row: AnimalCharacteristicRow): AnimalCharacteristic {
    return {
      id: row.id,
      animalId: row.animal_id,
      label: row.label,
      orderIndex: row.order_index,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toMedia(row: MediaAssetRow): MediaAsset {
    return {
      id: row.id,
      bucket: row.bucket,
      path: row.path,
      publicUrl: row.public_url,
      altText: row.alt_text,
      mediaType: row.media_type,
      uploadedBy: row.uploaded_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private async softDelete(
    table: string,
    id: string,
    animalId?: string,
  ): Promise<void> {
    let query = this.supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null);

    if (animalId) {
      query = query.eq('animal_id', animalId);
    }

    const { error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private readonly animalSelect =
    'id, created_by, name, slug, species, sex, size, age_label, status, is_sterilized, description, is_featured, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly imageSelect =
    'id, animal_id, media_id, is_primary, order_index, created_at, updated_at, deleted_at, media_assets(id, bucket, path, public_url, alt_text, media_type, uploaded_by, created_at, updated_at, deleted_at)';
  private readonly characteristicSelect =
    'id, animal_id, label, order_index, is_active, created_at, updated_at, deleted_at';
}
