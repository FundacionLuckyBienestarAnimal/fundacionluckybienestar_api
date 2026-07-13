import type { Publication } from '../../models/publications/publication';
import type { PublicationCategory } from '../../models/publications/publication-category';

export const PUBLICATION_REPOSITORY = Symbol('PUBLICATION_REPOSITORY');

export interface CreatePublicationCategoryInput {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdatePublicationCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreatePublicationInput {
  categoryId?: string;
  coverMediaId?: string;
  createdBy: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  type?: Publication['type'];
  status?: Publication['status'];
  featuredSection?: string;
  eventDate?: string;
  dateLabel?: string;
  ctaLabel?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
  publishedAt?: string;
}

export interface UpdatePublicationInput {
  categoryId?: string;
  coverMediaId?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  type?: Publication['type'];
  status?: Publication['status'];
  featuredSection?: string;
  eventDate?: string;
  dateLabel?: string;
  ctaLabel?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
  publishedAt?: string;
}

export interface PublicationRepositoryPort {
  findPublicCategories(): Promise<PublicationCategory[]>;
  findAdminCategories(): Promise<PublicationCategory[]>;
  findPublicPublications(): Promise<Publication[]>;
  findAdminPublications(): Promise<Publication[]>;
  findPublicPublicationBySlug(slug: string): Promise<Publication>;
  createCategory(
    input: CreatePublicationCategoryInput,
  ): Promise<PublicationCategory>;
  updateCategory(
    id: string,
    input: UpdatePublicationCategoryInput,
  ): Promise<PublicationCategory>;
  deleteCategory(id: string): Promise<void>;
  createPublication(input: CreatePublicationInput): Promise<Publication>;
  updatePublication(
    id: string,
    input: UpdatePublicationInput,
  ): Promise<Publication>;
  deletePublication(id: string): Promise<void>;
}
