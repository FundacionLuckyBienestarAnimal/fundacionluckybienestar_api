import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  ContactInfo,
  FaqItem,
  SocialLink,
} from '../../../../domain/models/settings/public-settings';
import type {
  CreateContactInfoInput,
  CreateFaqItemInput,
  CreateSocialLinkInput,
  SettingsRepositoryPort,
  UpdateContactInfoInput,
  UpdateFaqItemInput,
  UpdateSocialLinkInput,
} from '../../../../domain/ports/output/settings-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  ContactInfoRow,
  FaqItemRow,
  SocialLinkRow,
} from '../types/bdd-supabase';

@Injectable()
export class SettingsSupabaseRepository implements SettingsRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  findPublicContactInfo(): Promise<ContactInfo[]> {
    return this.findContactInfo(true);
  }

  findAdminContactInfo(): Promise<ContactInfo[]> {
    return this.findContactInfo(false);
  }

  async createContactInfo(input: CreateContactInfoInput): Promise<ContactInfo> {
    const { data, error } = await this.supabase
      .from('contact_info')
      .insert(this.contactPayload(input))
      .select(this.contactSelect)
      .single<ContactInfoRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toContactInfo(data);
  }

  async updateContactInfo(
    id: string,
    input: UpdateContactInfoInput,
  ): Promise<ContactInfo> {
    const { data, error } = await this.supabase
      .from('contact_info')
      .update(this.contactPayload(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.contactSelect)
      .single<ContactInfoRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toContactInfo(data);
  }

  deleteContactInfo(id: string): Promise<void> {
    return this.softDelete('contact_info', id);
  }

  findPublicSocialLinks(): Promise<SocialLink[]> {
    return this.findSocialLinks(true);
  }

  findAdminSocialLinks(): Promise<SocialLink[]> {
    return this.findSocialLinks(false);
  }

  async createSocialLink(input: CreateSocialLinkInput): Promise<SocialLink> {
    const { data, error } = await this.supabase
      .from('social_links')
      .insert(this.socialPayload(input))
      .select(this.socialSelect)
      .single<SocialLinkRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toSocialLink(data);
  }

  async updateSocialLink(
    id: string,
    input: UpdateSocialLinkInput,
  ): Promise<SocialLink> {
    const { data, error } = await this.supabase
      .from('social_links')
      .update(this.socialPayload(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.socialSelect)
      .single<SocialLinkRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toSocialLink(data);
  }

  deleteSocialLink(id: string): Promise<void> {
    return this.softDelete('social_links', id);
  }

  findPublicFaqItems(): Promise<FaqItem[]> {
    return this.findFaqItems(true);
  }

  findAdminFaqItems(): Promise<FaqItem[]> {
    return this.findFaqItems(false);
  }

  async createFaqItem(input: CreateFaqItemInput): Promise<FaqItem> {
    const { data, error } = await this.supabase
      .from('faq_items')
      .insert(this.faqPayload(input))
      .select(this.faqSelect)
      .single<FaqItemRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toFaqItem(data);
  }

  async updateFaqItem(id: string, input: UpdateFaqItemInput): Promise<FaqItem> {
    const { data, error } = await this.supabase
      .from('faq_items')
      .update(this.faqPayload(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.faqSelect)
      .single<FaqItemRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toFaqItem(data);
  }

  deleteFaqItem(id: string): Promise<void> {
    return this.softDelete('faq_items', id);
  }

  private async findContactInfo(publicOnly: boolean): Promise<ContactInfo[]> {
    let query = this.supabase
      .from('contact_info')
      .select(this.contactSelect)
      .is('deleted_at', null);

    if (publicOnly) query = query.eq('is_active', true);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .returns<ContactInfoRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toContactInfo(row));
  }

  private async findSocialLinks(publicOnly: boolean): Promise<SocialLink[]> {
    let query = this.supabase
      .from('social_links')
      .select(this.socialSelect)
      .is('deleted_at', null);

    if (publicOnly) query = query.eq('is_active', true);

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<SocialLinkRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toSocialLink(row));
  }

  private async findFaqItems(publicOnly: boolean): Promise<FaqItem[]> {
    let query = this.supabase
      .from('faq_items')
      .select(this.faqSelect)
      .is('deleted_at', null);

    if (publicOnly) query = query.eq('is_active', true);

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<FaqItemRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toFaqItem(row));
  }

  private async softDelete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) throw new InternalServerErrorException(error.message);
  }

  private contactPayload(input: CreateContactInfoInput) {
    return {
      whatsapp_number: input.whatsappNumber,
      phone_label: input.phoneLabel,
      email: input.email,
      address: input.address,
      map_embed_url: input.mapEmbedUrl,
      google_maps_url: input.googleMapsUrl,
      is_active: input.isActive,
    };
  }

  private socialPayload(input: CreateSocialLinkInput | UpdateSocialLinkInput) {
    return {
      platform: input.platform,
      label: input.label,
      url: input.url,
      icon: input.icon,
      is_active: input.isActive,
      order_index: input.orderIndex,
    };
  }

  private faqPayload(input: CreateFaqItemInput | UpdateFaqItemInput) {
    return {
      question: input.question,
      answer: input.answer,
      category: input.category,
      is_active: input.isActive,
      order_index: input.orderIndex,
    };
  }

  private toContactInfo(row: ContactInfoRow): ContactInfo {
    return {
      id: row.id,
      whatsappNumber: row.whatsapp_number,
      phoneLabel: row.phone_label,
      email: row.email,
      address: row.address,
      mapEmbedUrl: row.map_embed_url,
      googleMapsUrl: row.google_maps_url,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toSocialLink(row: SocialLinkRow): SocialLink {
    return {
      id: row.id,
      platform: row.platform,
      label: row.label,
      url: row.url,
      icon: row.icon,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toFaqItem(row: FaqItemRow): FaqItem {
    return {
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private readonly contactSelect =
    'id, whatsapp_number, phone_label, email, address, map_embed_url, google_maps_url, is_active, created_at, updated_at, deleted_at';
  private readonly socialSelect =
    'id, platform, label, url, icon, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly faqSelect =
    'id, question, answer, category, is_active, order_index, created_at, updated_at, deleted_at';
}
