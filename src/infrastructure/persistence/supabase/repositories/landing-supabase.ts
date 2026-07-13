import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type { HeroCard } from '../../../../domain/models/landing/hero-card';
import type { LandingImpactBlock } from '../../../../domain/models/landing/landing-impact-block';
import type { LandingInfoCard } from '../../../../domain/models/landing/landing-info-card';
import type {
  LandingSection,
  LandingSectionDetail,
} from '../../../../domain/models/landing/landing-section';
import type {
  CreateHeroCardInput,
  CreateLandingImpactBlockInput,
  CreateLandingInfoCardInput,
  CreateLandingSectionInput,
  LandingRepositoryPort,
  UpdateHeroCardInput,
  UpdateLandingImpactBlockInput,
  UpdateLandingInfoCardInput,
  UpdateLandingSectionInput,
} from '../../../../domain/ports/output/landing-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  HeroCardRow,
  LandingImpactBlockRow,
  LandingInfoCardRow,
  LandingSectionRow,
} from '../types/bdd-supabase';

@Injectable()
export class LandingSupabaseRepository implements LandingRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findPublicLanding(): Promise<LandingSectionDetail[]> {
    return this.findLanding(true);
  }

  async findAdminLanding(): Promise<LandingSectionDetail[]> {
    return this.findLanding(false);
  }

  async createSection(
    input: CreateLandingSectionInput,
  ): Promise<LandingSection> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .insert({
        key: input.key,
        title: input.title,
        highlighted_text: input.highlightedText,
        subtitle: input.subtitle,
        main_media_id: input.mainMediaId,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.sectionSelect)
      .single<LandingSectionRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toSection(data);
  }

  async createHeroCard(input: CreateHeroCardInput): Promise<HeroCard> {
    const { data, error } = await this.supabase
      .from('hero_cards')
      .insert({
        section_id: input.sectionId,
        title: input.title,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.heroCardSelect)
      .single<HeroCardRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toHeroCard(data);
  }

  async createImpactBlock(
    input: CreateLandingImpactBlockInput,
  ): Promise<LandingImpactBlock> {
    const { data, error } = await this.supabase
      .from('landing_impact_blocks')
      .insert({
        section_id: input.sectionId,
        prefix_text: input.prefixText,
        metric_value: input.metricValue,
        suffix_text: input.suffixText,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.impactBlockSelect)
      .single<LandingImpactBlockRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toImpactBlock(data);
  }

  async createInfoCard(
    input: CreateLandingInfoCardInput,
  ): Promise<LandingInfoCard> {
    const { data, error } = await this.supabase
      .from('landing_info_cards')
      .insert({
        section_id: input.sectionId,
        title: input.title,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .select(this.infoCardSelect)
      .single<LandingInfoCardRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toInfoCard(data);
  }

  async updateSection(
    id: string,
    input: UpdateLandingSectionInput,
  ): Promise<LandingSection> {
    const { data, error } = await this.supabase
      .from('landing_sections')
      .update({
        title: input.title,
        highlighted_text: input.highlightedText,
        subtitle: input.subtitle,
        main_media_id: input.mainMediaId,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.sectionSelect)
      .single<LandingSectionRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toSection(data);
  }

  async updateHeroCard(
    id: string,
    input: UpdateHeroCardInput,
  ): Promise<HeroCard> {
    const { data, error } = await this.supabase
      .from('hero_cards')
      .update({
        title: input.title,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.heroCardSelect)
      .single<HeroCardRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toHeroCard(data);
  }

  async updateImpactBlock(
    id: string,
    input: UpdateLandingImpactBlockInput,
  ): Promise<LandingImpactBlock> {
    const { data, error } = await this.supabase
      .from('landing_impact_blocks')
      .update({
        prefix_text: input.prefixText,
        metric_value: input.metricValue,
        suffix_text: input.suffixText,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.impactBlockSelect)
      .single<LandingImpactBlockRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toImpactBlock(data);
  }

  async updateInfoCard(
    id: string,
    input: UpdateLandingInfoCardInput,
  ): Promise<LandingInfoCard> {
    const { data, error } = await this.supabase
      .from('landing_info_cards')
      .update({
        title: input.title,
        description: input.description,
        icon: input.icon,
        cta_label: input.ctaLabel,
        cta_href: input.ctaHref,
        is_active: input.isActive,
        order_index: input.orderIndex,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.infoCardSelect)
      .single<LandingInfoCardRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toInfoCard(data);
  }

  deleteSection(id: string): Promise<void> {
    return this.softDelete('landing_sections', id);
  }

  deleteHeroCard(id: string): Promise<void> {
    return this.softDelete('hero_cards', id);
  }

  deleteImpactBlock(id: string): Promise<void> {
    return this.softDelete('landing_impact_blocks', id);
  }

  deleteInfoCard(id: string): Promise<void> {
    return this.softDelete('landing_info_cards', id);
  }

  private async findLanding(
    onlyActive: boolean,
  ): Promise<LandingSectionDetail[]> {
    const sections = await this.findSections(onlyActive);

    if (sections.length === 0) {
      return [];
    }

    const sectionIds = sections.map((section) => section.id);
    const [heroCards, impactBlocks, infoCards] = await Promise.all([
      this.findHeroCards(sectionIds, onlyActive),
      this.findImpactBlocks(sectionIds, onlyActive),
      this.findInfoCards(sectionIds, onlyActive),
    ]);

    return sections.map((section) => ({
      ...section,
      heroCards: heroCards.filter((item) => item.sectionId === section.id),
      impactBlocks: impactBlocks.filter(
        (item) => item.sectionId === section.id,
      ),
      infoCards: infoCards.filter((item) => item.sectionId === section.id),
    }));
  }

  private async findSections(onlyActive: boolean): Promise<LandingSection[]> {
    let query = this.supabase
      .from('landing_sections')
      .select(this.sectionSelect)
      .is('deleted_at', null);

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<LandingSectionRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toSection(row));
  }

  private async findHeroCards(
    sectionIds: string[],
    onlyActive: boolean,
  ): Promise<HeroCard[]> {
    let query = this.supabase
      .from('hero_cards')
      .select(this.heroCardSelect)
      .in('section_id', sectionIds)
      .is('deleted_at', null);

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<HeroCardRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toHeroCard(row));
  }

  private async findImpactBlocks(
    sectionIds: string[],
    onlyActive: boolean,
  ): Promise<LandingImpactBlock[]> {
    let query = this.supabase
      .from('landing_impact_blocks')
      .select(this.impactBlockSelect)
      .in('section_id', sectionIds)
      .is('deleted_at', null);

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<LandingImpactBlockRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toImpactBlock(row));
  }

  private async findInfoCards(
    sectionIds: string[],
    onlyActive: boolean,
  ): Promise<LandingInfoCard[]> {
    let query = this.supabase
      .from('landing_info_cards')
      .select(this.infoCardSelect)
      .in('section_id', sectionIds)
      .is('deleted_at', null);

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<LandingInfoCardRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toInfoCard(row));
  }

  private toSection(row: LandingSectionRow): LandingSection {
    if (!row) {
      throw new NotFoundException('Landing section not found');
    }

    return {
      id: row.id,
      key: row.key,
      title: row.title,
      highlightedText: row.highlighted_text,
      subtitle: row.subtitle,
      mainMediaId: row.main_media_id,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toHeroCard(row: HeroCardRow): HeroCard {
    return {
      id: row.id,
      sectionId: row.section_id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      ctaLabel: row.cta_label,
      ctaHref: row.cta_href,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toImpactBlock(row: LandingImpactBlockRow): LandingImpactBlock {
    return {
      id: row.id,
      sectionId: row.section_id,
      prefixText: row.prefix_text,
      metricValue: row.metric_value,
      suffixText: row.suffix_text,
      description: row.description,
      icon: row.icon,
      ctaLabel: row.cta_label,
      ctaHref: row.cta_href,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toInfoCard(row: LandingInfoCardRow): LandingInfoCard {
    return {
      id: row.id,
      sectionId: row.section_id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      ctaLabel: row.cta_label,
      ctaHref: row.cta_href,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
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

  private readonly sectionSelect =
    'id, key, title, highlighted_text, subtitle, main_media_id, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly heroCardSelect =
    'id, section_id, title, description, icon, cta_label, cta_href, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly impactBlockSelect =
    'id, section_id, prefix_text, metric_value, suffix_text, description, icon, cta_label, cta_href, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly infoCardSelect =
    'id, section_id, title, description, icon, cta_label, cta_href, is_active, order_index, created_at, updated_at, deleted_at';
}
