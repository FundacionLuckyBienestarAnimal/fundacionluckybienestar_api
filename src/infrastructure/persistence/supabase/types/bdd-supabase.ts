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
