import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Publication } from '../../../../domain/models/publications/publication';
import type { PublicationCategory } from '../../../../domain/models/publications/publication-category';
import type {
  CreatePublicationCategoryInput,
  CreatePublicationInput,
  PublicationRepositoryPort,
  UpdatePublicationCategoryInput,
  UpdatePublicationInput,
} from '../../../../domain/ports/output/publication-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  PublicationCategoryRow,
  PublicationRow,
} from '../types/bdd-supabase';

@Injectable()
export class PublicationSupabaseRepository implements PublicationRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findPublicCategories(): Promise<PublicationCategory[]> {
    const { data, error } = await this.supabase
      .from('publication_categories')
      .select(this.categorySelect)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<PublicationCategoryRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toCategory(row));
  }

  async findAdminCategories(): Promise<PublicationCategory[]> {
    const { data, error } = await this.supabase
      .from('publication_categories')
      .select(this.categorySelect)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<PublicationCategoryRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toCategory(row));
  }

  async findPublicPublications(): Promise<Publication[]> {
    const { data, error } = await this.supabase
      .from('publications')
      .select(this.publicationSelect)
      .eq('status', 'published')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .returns<PublicationRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toPublication(row));
  }

  async findAdminPublications(): Promise<Publication[]> {
    const { data, error } = await this.supabase
      .from('publications')
      .select(this.publicationSelect)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<PublicationRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toPublication(row));
  }

  async findPublicPublicationBySlug(slug: string): Promise<Publication> {
    const { data, error } = await this.supabase
      .from('publications')
      .select(this.publicationSelect)
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('is_active', true)
      .is('deleted_at', null)
      .single<PublicationRow>();

    if (error) {
      throw new NotFoundException('Publication not found');
    }

    return this.toPublication(data);
  }

  async createCategory(
    input: CreatePublicationCategoryInput,
  ): Promise<PublicationCategory> {
    const { data, error } = await this.supabase
      .from('publication_categories')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.categorySelect)
      .single<PublicationCategoryRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toCategory(data);
  }

  async updateCategory(
    id: string,
    input: UpdatePublicationCategoryInput,
  ): Promise<PublicationCategory> {
    const { data, error } = await this.supabase
      .from('publication_categories')
      .update({
        name: input.name,
        slug: input.slug,
        description: input.description,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.categorySelect)
      .single<PublicationCategoryRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toCategory(data);
  }

  deleteCategory(id: string): Promise<void> {
    return this.softDelete('publication_categories', id);
  }

  async createPublication(input: CreatePublicationInput): Promise<Publication> {
    const { data, error } = await this.supabase
      .from('publications')
      .insert({
        category_id: input.categoryId,
        cover_media_id: input.coverMediaId,
        created_by: input.createdBy,
        title: input.title,
        slug: input.slug,
        subtitle: input.subtitle,
        description: input.description,
        content: input.content,
        type: input.type,
        status: input.status,
        featured_section: input.featuredSection,
        event_date: input.eventDate,
        date_label: input.dateLabel,
        cta_label: input.ctaLabel,
        is_featured: input.isFeatured,
        is_active: input.isActive,
        order_index: input.orderIndex,
        published_at: input.publishedAt,
      })
      .select(this.publicationSelect)
      .single<PublicationRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toPublication(data);
  }

  async updatePublication(
    id: string,
    input: UpdatePublicationInput,
  ): Promise<Publication> {
    const { data, error } = await this.supabase
      .from('publications')
      .update({
        category_id: input.categoryId,
        cover_media_id: input.coverMediaId,
        title: input.title,
        slug: input.slug,
        subtitle: input.subtitle,
        description: input.description,
        content: input.content,
        type: input.type,
        status: input.status,
        featured_section: input.featuredSection,
        event_date: input.eventDate,
        date_label: input.dateLabel,
        cta_label: input.ctaLabel,
        is_featured: input.isFeatured,
        is_active: input.isActive,
        order_index: input.orderIndex,
        published_at: input.publishedAt,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.publicationSelect)
      .single<PublicationRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toPublication(data);
  }

  deletePublication(id: string): Promise<void> {
    return this.softDelete('publications', id);
  }

  private toCategory(row: PublicationCategoryRow): PublicationCategory {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toPublication(row: PublicationRow): Publication {
    return {
      id: row.id,
      categoryId: row.category_id,
      coverMediaId: row.cover_media_id,
      createdBy: row.created_by,
      title: row.title,
      slug: row.slug,
      subtitle: row.subtitle,
      description: row.description,
      content: row.content,
      type: row.type,
      status: row.status,
      featuredSection: row.featured_section,
      eventDate: row.event_date,
      dateLabel: row.date_label,
      ctaLabel: row.cta_label,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      orderIndex: row.order_index,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      category: row.publication_categories
        ? this.toCategory(row.publication_categories)
        : null,
    };
  }

  private async softDelete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .update({
        deleted_at: new Date().toISOString(),
        is_active: false,
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private readonly categorySelect =
    'id, name, slug, description, is_active, order_index, created_at, updated_at, deleted_at';

  private readonly publicationSelect =
    'id, category_id, cover_media_id, created_by, title, slug, subtitle, description, content, type, status, featured_section, event_date, date_label, cta_label, is_featured, is_active, order_index, published_at, created_at, updated_at, deleted_at, publication_categories(id, name, slug, description, is_active, order_index, created_at, updated_at, deleted_at)';
}
