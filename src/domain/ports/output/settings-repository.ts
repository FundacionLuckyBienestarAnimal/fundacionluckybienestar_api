import type {
  ContactInfo,
  FaqItem,
  SocialLink,
} from '../../models/settings/public-settings';

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');

export interface CreateContactInfoInput {
  whatsappNumber?: string;
  phoneLabel?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  isActive?: boolean;
}

export type UpdateContactInfoInput = CreateContactInfoInput;

export interface CreateSocialLinkInput {
  platform: string;
  label?: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateSocialLinkInput {
  platform?: string;
  label?: string;
  url?: string;
  icon?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateFaqItemInput {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateFaqItemInput {
  question?: string;
  answer?: string;
  category?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface SettingsRepositoryPort {
  findPublicContactInfo(): Promise<ContactInfo[]>;
  findAdminContactInfo(): Promise<ContactInfo[]>;
  createContactInfo(input: CreateContactInfoInput): Promise<ContactInfo>;
  updateContactInfo(
    id: string,
    input: UpdateContactInfoInput,
  ): Promise<ContactInfo>;
  deleteContactInfo(id: string): Promise<void>;
  findPublicSocialLinks(): Promise<SocialLink[]>;
  findAdminSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(input: CreateSocialLinkInput): Promise<SocialLink>;
  updateSocialLink(
    id: string,
    input: UpdateSocialLinkInput,
  ): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<void>;
  findPublicFaqItems(): Promise<FaqItem[]>;
  findAdminFaqItems(): Promise<FaqItem[]>;
  createFaqItem(input: CreateFaqItemInput): Promise<FaqItem>;
  updateFaqItem(id: string, input: UpdateFaqItemInput): Promise<FaqItem>;
  deleteFaqItem(id: string): Promise<void>;
}
