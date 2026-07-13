import type { PublicationCategory } from './publication-category';

export type PublicationType = 'post' | 'campaign' | 'event' | 'news' | 'about';
export type PublicationStatus =
  'draft' | 'scheduled' | 'published' | 'archived';

export interface Publication {
  id: string;
  categoryId: string | null;
  coverMediaId: string | null;
  createdBy: string | null;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  content: string | null;
  type: PublicationType;
  status: PublicationStatus;
  featuredSection: string | null;
  eventDate: string | null;
  dateLabel: string | null;
  ctaLabel: string | null;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: PublicationCategory | null;
}
