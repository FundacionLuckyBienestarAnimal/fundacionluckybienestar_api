export interface AvatarOption {
  id: string;
  key: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  sourceModule: string | null;
  sourceId: string | null;
  awardedAt: string;
  awardedBy: string | null;
  badge: Badge | null;
}

export interface ManagedRole {
  key: string;
  name: string;
  description: string | null;
  isInternal: boolean;
  createdAt: string;
}

export interface ManagedPermission {
  key: string;
  module: string;
  description: string;
  createdAt: string;
}

export interface RolePermissionAssignment {
  roleKey: string;
  permissionKey: string;
  createdAt: string;
  permission: ManagedPermission | null;
}
