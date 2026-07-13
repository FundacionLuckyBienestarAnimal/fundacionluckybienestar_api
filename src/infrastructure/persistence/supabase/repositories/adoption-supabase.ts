import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  AdoptionApplication,
  AdoptionStatus,
  HousingType,
} from '../../../../domain/models/adoptions/adoption';
import type {
  AdoptionRepositoryPort,
  CreateAdoptionApplicationInput,
  CreateHousingTypeInput,
  UpdateAdoptionStatusInput,
  UpdateHousingTypeInput,
} from '../../../../domain/ports/output/adoption-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  AdoptionApplicationRow,
  HousingTypeRow,
} from '../types/bdd-supabase';

@Injectable()
export class AdoptionSupabaseRepository implements AdoptionRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findPublicHousingTypes(): Promise<HousingType[]> {
    const { data, error } = await this.supabase
      .from('housing_types')
      .select(this.housingTypeSelect)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<HousingTypeRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toHousingType(row));
  }

  async findAdminHousingTypes(): Promise<HousingType[]> {
    const { data, error } = await this.supabase
      .from('housing_types')
      .select(this.housingTypeSelect)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<HousingTypeRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toHousingType(row));
  }

  async createHousingType(input: CreateHousingTypeInput): Promise<HousingType> {
    const { data, error } = await this.supabase
      .from('housing_types')
      .insert({
        key: input.key,
        name: input.name,
        description: input.description,
        requires_other_detail: input.requiresOtherDetail,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.housingTypeSelect)
      .single<HousingTypeRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toHousingType(data);
  }

  async updateHousingType(
    id: string,
    input: UpdateHousingTypeInput,
  ): Promise<HousingType> {
    const { data, error } = await this.supabase
      .from('housing_types')
      .update({
        key: input.key,
        name: input.name,
        description: input.description,
        requires_other_detail: input.requiresOtherDetail,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.housingTypeSelect)
      .single<HousingTypeRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toHousingType(data);
  }

  deleteHousingType(id: string): Promise<void> {
    return this.softDelete('housing_types', id);
  }

  async createApplication(
    input: CreateAdoptionApplicationInput,
  ): Promise<AdoptionApplication> {
    const { data, error } = await this.supabase
      .from('adoption_applications')
      .insert({
        user_id: input.userId,
        animal_id: input.animalId,
        housing_type_id: input.housingTypeId,
        housing_other_detail: input.housingOtherDetail,
        adoption_reason: input.adoptionReason,
      })
      .select(this.applicationSelect)
      .single<AdoptionApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    await this.insertHistory(data.id, null, data.status, null, input.userId);
    return this.toApplication(data);
  }

  async findMyApplications(userId: string): Promise<AdoptionApplication[]> {
    const { data, error } = await this.supabase
      .from('adoption_applications')
      .select(this.applicationSelect)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<AdoptionApplicationRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toApplication(row));
  }

  async findAdminApplications(): Promise<AdoptionApplication[]> {
    const { data, error } = await this.supabase
      .from('adoption_applications')
      .select(this.applicationSelect)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<AdoptionApplicationRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toApplication(row));
  }

  async updateApplicationStatus(
    id: string,
    input: UpdateAdoptionStatusInput,
  ): Promise<AdoptionApplication> {
    const current = await this.findApplicationById(id);
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('adoption_applications')
      .update({
        status: input.status,
        reviewed_by: input.changedBy,
        review_message: input.reviewMessage,
        reviewed_at: now,
        process_started_at: input.status === 'in_process' ? now : undefined,
        completed_at: input.status === 'completed' ? now : undefined,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.applicationSelect)
      .single<AdoptionApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    await this.insertHistory(
      id,
      current.status,
      input.status,
      input.reviewMessage,
      input.changedBy,
    );
    return this.toApplication(data);
  }

  private async findApplicationById(id: string): Promise<AdoptionApplication> {
    const { data, error } = await this.supabase
      .from('adoption_applications')
      .select(this.applicationSelect)
      .eq('id', id)
      .is('deleted_at', null)
      .single<AdoptionApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toApplication(data);
  }

  private async insertHistory(
    applicationId: string,
    previousStatus: AdoptionStatus | null,
    newStatus: AdoptionStatus,
    message: string | null | undefined,
    changedBy: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('adoption_status_history')
      .insert({
        application_id: applicationId,
        previous_status: previousStatus,
        new_status: newStatus,
        message,
        changed_by: changedBy,
      });

    if (error) throw new InternalServerErrorException(error.message);
  }

  private async softDelete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) throw new InternalServerErrorException(error.message);
  }

  private toHousingType(row: HousingTypeRow): HousingType {
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      description: row.description,
      requiresOtherDetail: row.requires_other_detail,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toApplication(row: AdoptionApplicationRow): AdoptionApplication {
    return {
      id: row.id,
      userId: row.user_id,
      animalId: row.animal_id,
      housingTypeId: row.housing_type_id,
      housingOtherDetail: row.housing_other_detail,
      adoptionReason: row.adoption_reason,
      status: row.status,
      reviewedBy: row.reviewed_by,
      reviewMessage: row.review_message,
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      processStartedAt: row.process_started_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      housingType: row.housing_types
        ? this.toHousingType(row.housing_types)
        : null,
    };
  }

  private readonly housingTypeSelect =
    'id, key, name, description, requires_other_detail, is_active, order_index, created_at, updated_at, deleted_at';

  private readonly applicationSelect =
    'id, user_id, animal_id, housing_type_id, housing_other_detail, adoption_reason, status, reviewed_by, review_message, submitted_at, reviewed_at, process_started_at, completed_at, created_at, updated_at, deleted_at, housing_types(id, key, name, description, requires_other_detail, is_active, order_index, created_at, updated_at, deleted_at)';
}
