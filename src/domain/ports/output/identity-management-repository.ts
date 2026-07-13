import type {
  AvatarOption,
  Badge,
  ManagedPermission,
  ManagedRole,
  RolePermissionAssignment,
  UserBadge,
} from '../../models/access-control/identity-management';

export const IDENTITY_MANAGEMENT_REPOSITORY = Symbol(
  'IDENTITY_MANAGEMENT_REPOSITORY',
);

export interface CreateAvatarOptionInput {
  key: string;
  name: string;
  imageUrl: string;
  isDefault?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateAvatarOptionInput {
  key?: string;
  name?: string;
  imageUrl?: string;
  isDefault?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateBadgeInput {
  key: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateBadgeInput {
  key?: string;
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface AssignUserBadgeInput {
  userId: string;
  badgeId: string;
  sourceModule?: string;
  sourceId?: string;
  awardedBy?: string;
}

export interface CreateRoleInput {
  key: string;
  name: string;
  description?: string;
  isInternal?: boolean;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  isInternal?: boolean;
}

export interface CreatePermissionInput {
  key: string;
  module: string;
  description: string;
}

export interface UpdatePermissionInput {
  module?: string;
  description?: string;
}

export interface IdentityManagementRepositoryPort {
  findPublicAvatars(): Promise<AvatarOption[]>;
  findAdminAvatars(): Promise<AvatarOption[]>;
  createAvatar(input: CreateAvatarOptionInput): Promise<AvatarOption>;
  updateAvatar(
    id: string,
    input: UpdateAvatarOptionInput,
  ): Promise<AvatarOption>;
  deleteAvatar(id: string): Promise<void>;
  findPublicBadges(): Promise<Badge[]>;
  findAdminBadges(): Promise<Badge[]>;
  createBadge(input: CreateBadgeInput): Promise<Badge>;
  updateBadge(id: string, input: UpdateBadgeInput): Promise<Badge>;
  deleteBadge(id: string): Promise<void>;
  findUserBadges(userId: string): Promise<UserBadge[]>;
  assignUserBadge(input: AssignUserBadgeInput): Promise<UserBadge>;
  removeUserBadge(userBadgeId: string): Promise<void>;
  findRoles(): Promise<ManagedRole[]>;
  createRole(input: CreateRoleInput): Promise<ManagedRole>;
  updateRole(key: string, input: UpdateRoleInput): Promise<ManagedRole>;
  deleteRole(key: string): Promise<void>;
  findPermissions(): Promise<ManagedPermission[]>;
  createPermission(input: CreatePermissionInput): Promise<ManagedPermission>;
  updatePermission(
    key: string,
    input: UpdatePermissionInput,
  ): Promise<ManagedPermission>;
  deletePermission(key: string): Promise<void>;
  findRolePermissions(roleKey: string): Promise<RolePermissionAssignment[]>;
  assignPermissionToRole(
    roleKey: string,
    permissionKey: string,
  ): Promise<RolePermissionAssignment>;
  removePermissionFromRole(
    roleKey: string,
    permissionKey: string,
  ): Promise<void>;
}
