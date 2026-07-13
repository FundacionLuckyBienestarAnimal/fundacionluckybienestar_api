export interface ContactInfo {
  id: string;
  whatsappNumber: string | null;
  phoneLabel: string | null;
  email: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  googleMapsUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  icon: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
