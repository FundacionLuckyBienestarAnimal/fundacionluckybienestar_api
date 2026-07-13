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
