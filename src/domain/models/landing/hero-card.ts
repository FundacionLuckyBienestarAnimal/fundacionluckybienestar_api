export interface HeroCard {
  id: string;
  sectionId: string;
  title: string;
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
