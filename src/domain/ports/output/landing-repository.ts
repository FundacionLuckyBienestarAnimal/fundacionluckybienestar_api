import type { HeroCard } from '../../models/landing/hero-card';
import type { LandingImpactBlock } from '../../models/landing/landing-impact-block';
import type { LandingInfoCard } from '../../models/landing/landing-info-card';
import type {
  LandingSection,
  LandingSectionDetail,
} from '../../models/landing/landing-section';

export const LANDING_REPOSITORY = Symbol('LANDING_REPOSITORY');

export interface UpdateLandingSectionInput {
  title?: string;
  highlightedText?: string;
  subtitle?: string;
  mainMediaId?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateLandingSectionInput extends UpdateLandingSectionInput {
  key: string;
}

export interface UpdateHeroCardInput {
  title?: string;
  description?: string;
  icon?: string;
  ctaLabel?: string;
  ctaHref?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateHeroCardInput extends UpdateHeroCardInput {
  sectionId: string;
  title: string;
}

export interface UpdateLandingImpactBlockInput {
  prefixText?: string;
  metricValue?: number;
  suffixText?: string;
  description?: string;
  icon?: string;
  ctaLabel?: string;
  ctaHref?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateLandingImpactBlockInput extends UpdateLandingImpactBlockInput {
  sectionId: string;
  metricValue: number;
}

export interface UpdateLandingInfoCardInput {
  title?: string;
  description?: string;
  icon?: string;
  ctaLabel?: string;
  ctaHref?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateLandingInfoCardInput extends UpdateLandingInfoCardInput {
  sectionId: string;
  title: string;
}

export interface LandingRepositoryPort {
  findPublicLanding(): Promise<LandingSectionDetail[]>;
  findAdminLanding(): Promise<LandingSectionDetail[]>;
  createSection(input: CreateLandingSectionInput): Promise<LandingSection>;
  createHeroCard(input: CreateHeroCardInput): Promise<HeroCard>;
  createImpactBlock(
    input: CreateLandingImpactBlockInput,
  ): Promise<LandingImpactBlock>;
  createInfoCard(input: CreateLandingInfoCardInput): Promise<LandingInfoCard>;
  updateSection(
    id: string,
    input: UpdateLandingSectionInput,
  ): Promise<LandingSection>;
  updateHeroCard(id: string, input: UpdateHeroCardInput): Promise<HeroCard>;
  updateImpactBlock(
    id: string,
    input: UpdateLandingImpactBlockInput,
  ): Promise<LandingImpactBlock>;
  updateInfoCard(
    id: string,
    input: UpdateLandingInfoCardInput,
  ): Promise<LandingInfoCard>;
  deleteSection(id: string): Promise<void>;
  deleteHeroCard(id: string): Promise<void>;
  deleteImpactBlock(id: string): Promise<void>;
  deleteInfoCard(id: string): Promise<void>;
}
