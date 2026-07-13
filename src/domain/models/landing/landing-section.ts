import type { HeroCard } from './hero-card';
import type { LandingImpactBlock } from './landing-impact-block';
import type { LandingInfoCard } from './landing-info-card';

export interface LandingSection {
  id: string;
  key: string;
  title: string | null;
  highlightedText: string | null;
  subtitle: string | null;
  mainMediaId: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LandingSectionDetail extends LandingSection {
  heroCards: HeroCard[];
  impactBlocks: LandingImpactBlock[];
  infoCards: LandingInfoCard[];
}
