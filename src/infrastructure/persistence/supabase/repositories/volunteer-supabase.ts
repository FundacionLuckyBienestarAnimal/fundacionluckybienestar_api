import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  VolunteerApplication,
  VolunteerApplicationStatus,
  VolunteerProfile,
  VolunteerRequirement,
} from '../../../../domain/models/volunteers/volunteer';
import type {
  CreateVolunteerApplicationInput,
  CreateVolunteerRequirementInput,
  UpdateVolunteerApplicationStatusInput,
  UpdateVolunteerRequirementInput,
  VolunteerRepositoryPort,
} from '../../../../domain/ports/output/volunteer-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  VolunteerApplicationRow,
  VolunteerProfileRow,
  VolunteerRequirementRow,
} from '../types/bdd-supabase';

@Injectable()
export class VolunteerSupabaseRepository implements VolunteerRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findPublicRequirements(): Promise<VolunteerRequirement[]> {
    const { data, error } = await this.supabase
      .from('volunteer_requirements')
      .select(this.requirementSelect)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<VolunteerRequirementRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toRequirement(row));
  }

  async findAdminRequirements(): Promise<VolunteerRequirement[]> {
    const { data, error } = await this.supabase
      .from('volunteer_requirements')
      .select(this.requirementSelect)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<VolunteerRequirementRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toRequirement(row));
  }

  async createRequirement(
    input: CreateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement> {
    const { data, error } = await this.supabase
      .from('volunteer_requirements')
      .insert({
        title: input.title,
        description: input.description,
        type: input.type,
        is_required: input.isRequired,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.requirementSelect)
      .single<VolunteerRequirementRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toRequirement(data);
  }

  async updateRequirement(
    id: string,
    input: UpdateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement> {
    const { data, error } = await this.supabase
      .from('volunteer_requirements')
      .update({
        title: input.title,
        description: input.description,
        type: input.type,
        is_required: input.isRequired,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.requirementSelect)
      .single<VolunteerRequirementRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toRequirement(data);
  }

  deleteRequirement(id: string): Promise<void> {
    return this.softDelete('volunteer_requirements', id);
  }

  async createApplication(
    input: CreateVolunteerApplicationInput,
  ): Promise<VolunteerApplication> {
    const { data, error } = await this.supabase
      .from('volunteer_applications')
      .insert({
        user_id: input.userId,
        motivation: input.motivation,
        availability_type: input.availabilityType,
        is_adult_confirmed: input.isAdultConfirmed,
      })
      .select(this.applicationSelect)
      .single<VolunteerApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    await this.insertHistory(data.id, null, data.status, null, input.userId);
    return this.toApplication(data);
  }

  async findMyApplications(userId: string): Promise<VolunteerApplication[]> {
    const { data, error } = await this.supabase
      .from('volunteer_applications')
      .select(this.applicationSelect)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<VolunteerApplicationRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toApplication(row));
  }

  async findAdminApplications(): Promise<VolunteerApplication[]> {
    const { data, error } = await this.supabase
      .from('volunteer_applications')
      .select(this.applicationSelect)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<VolunteerApplicationRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toApplication(row));
  }

  async updateApplicationStatus(
    id: string,
    input: UpdateVolunteerApplicationStatusInput,
  ): Promise<VolunteerApplication> {
    const current = await this.findApplicationById(id);
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('volunteer_applications')
      .update({
        status: input.status,
        reviewed_by: input.changedBy,
        review_message: input.reviewMessage,
        reviewed_at: now,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.applicationSelect)
      .single<VolunteerApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    await this.insertHistory(
      id,
      current.status,
      input.status,
      input.reviewMessage,
      input.changedBy,
    );

    if (input.status === 'approved') {
      await this.ensureVolunteerProfile(data, input.changedBy);
    }

    return this.toApplication(data);
  }

  async findProfiles(): Promise<VolunteerProfile[]> {
    const { data, error } = await this.supabase
      .from('volunteer_profiles')
      .select(this.profileSelect)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<VolunteerProfileRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toProfile(row));
  }

  private async findApplicationById(id: string): Promise<VolunteerApplication> {
    const { data, error } = await this.supabase
      .from('volunteer_applications')
      .select(this.applicationSelect)
      .eq('id', id)
      .is('deleted_at', null)
      .single<VolunteerApplicationRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toApplication(data);
  }

  private async insertHistory(
    applicationId: string,
    previousStatus: VolunteerApplicationStatus | null,
    newStatus: VolunteerApplicationStatus,
    message: string | null | undefined,
    changedBy: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('volunteer_application_status_history')
      .insert({
        application_id: applicationId,
        previous_status: previousStatus,
        new_status: newStatus,
        message,
        changed_by: changedBy,
      });

    if (error) throw new InternalServerErrorException(error.message);
  }

  private async ensureVolunteerProfile(
    application: VolunteerApplicationRow,
    approvedBy: string,
  ): Promise<void> {
    const { error } = await this.supabase.from('volunteer_profiles').upsert(
      {
        user_id: application.user_id,
        approved_application_id: application.id,
        status: 'active',
        approved_by: approvedBy,
      },
      { onConflict: 'user_id' },
    );

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

  private toRequirement(row: VolunteerRequirementRow): VolunteerRequirement {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      isRequired: row.is_required,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toApplication(row: VolunteerApplicationRow): VolunteerApplication {
    return {
      id: row.id,
      userId: row.user_id,
      motivation: row.motivation,
      availabilityType: row.availability_type,
      status: row.status,
      isAdultConfirmed: row.is_adult_confirmed,
      reviewedBy: row.reviewed_by,
      reviewMessage: row.review_message,
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toProfile(row: VolunteerProfileRow): VolunteerProfile {
    return {
      id: row.id,
      userId: row.user_id,
      approvedApplicationId: row.approved_application_id,
      status: row.status,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private readonly requirementSelect =
    'id, title, description, type, is_required, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly applicationSelect =
    'id, user_id, motivation, availability_type, status, is_adult_confirmed, reviewed_by, review_message, submitted_at, reviewed_at, created_at, updated_at, deleted_at';
  private readonly profileSelect =
    'id, user_id, approved_application_id, status, approved_at, approved_by, created_at, updated_at, deleted_at';
}
