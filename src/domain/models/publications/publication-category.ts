export interface PublicationCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
