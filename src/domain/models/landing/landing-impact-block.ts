export interface LandingImpactBlock {
  id: string;
  sectionId: string;
  prefixText: string | null;
  metricValue: number;
  suffixText: string | null;
  description: string | null;
  icon: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
