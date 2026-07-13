export type ProfileRow = {
  id: string;
  avatar_id: string | null;
  first_names: string | null;
  last_names: string | null;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  housing_sector: string | null;
  status: 'active' | 'inactive' | 'blocked';
  user_type: 'public' | 'staff';
  created_at: string;
  updated_at: string;
};

export type UserRoleRow = {
  role_key: string;
  roles: {
    key: string;
    name: string;
    description: string | null;
    is_internal: boolean;
    created_at: string;
  } | null;
};

export type RolePermissionRow = {
  role_key: string;
  permissions: {
    key: string;
    module: string;
    description: string;
    created_at: string;
  } | null;
};

export type MediaAssetRow = {
  id: string;
  bucket: string;
  path: string;
  public_url: string | null;
  alt_text: string | null;
  media_type: 'image' | 'video' | 'document' | 'other';
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LandingSectionRow = {
  id: string;
  key: string;
  title: string | null;
  highlighted_text: string | null;
  subtitle: string | null;
  main_media_id: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type HeroCardRow = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LandingImpactBlockRow = {
  id: string;
  section_id: string;
  prefix_text: string | null;
  metric_value: number;
  suffix_text: string | null;
  description: string | null;
  icon: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LandingInfoCardRow = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PublicationCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PublicationRow = {
  id: string;
  category_id: string | null;
  cover_media_id: string | null;
  created_by: string | null;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  content: string | null;
  type: 'post' | 'campaign' | 'event' | 'news' | 'about';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  featured_section: string | null;
  event_date: string | null;
  date_label: string | null;
  cta_label: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  publication_categories?: PublicationCategoryRow | null;
};

export type AnimalProfileRow = {
  id: string;
  created_by: string | null;
  name: string;
  slug: string;
  species: 'dog' | 'cat' | 'other';
  sex: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large';
  age_label: string | null;
  status: 'available' | 'in_process' | 'sponsored' | 'adopted' | 'hidden';
  is_sterilized: boolean;
  description: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AnimalImageRow = {
  id: string;
  animal_id: string;
  media_id: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  media_assets?: MediaAssetRow | null;
};

export type AnimalCharacteristicRow = {
  id: string;
  animal_id: string;
  label: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type HousingTypeRow = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  requires_other_detail: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type AdoptionApplicationRow = {
  id: string;
  user_id: string;
  animal_id: string;
  housing_type_id: string;
  housing_other_detail: string | null;
  adoption_reason: string;
  status:
    | 'submitted'
    | 'under_review'
    | 'in_process'
    | 'completed'
    | 'rejected'
    | 'cancelled';
  reviewed_by: string | null;
  review_message: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  process_started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  housing_types?: HousingTypeRow | null;
};

export type VolunteerRequirementRow = {
  id: string;
  title: string;
  description: string | null;
  type: 'material' | 'schedule' | 'condition' | 'other';
  is_required: boolean;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type VolunteerApplicationRow = {
  id: string;
  user_id: string;
  motivation: string;
  availability_type: 'weekdays' | 'weekends' | 'both';
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  is_adult_confirmed: boolean;
  reviewed_by: string | null;
  review_message: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type VolunteerProfileRow = {
  id: string;
  user_id: string;
  approved_application_id: string;
  status: 'active' | 'inactive' | 'suspended';
  approved_at: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ContactInfoRow = {
  id: string;
  whatsapp_number: string | null;
  phone_label: string | null;
  email: string | null;
  address: string | null;
  map_embed_url: string | null;
  google_maps_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SocialLinkRow = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  icon: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type FaqItemRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
