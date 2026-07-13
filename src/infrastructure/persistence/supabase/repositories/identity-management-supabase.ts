import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  AvatarOption,
  Badge,
  ManagedPermission,
  ManagedRole,
  RolePermissionAssignment,
  UserBadge,
} from '../../../../domain/models/access-control/identity-management';
import type {
  AssignUserBadgeInput,
  CreateAvatarOptionInput,
  CreateBadgeInput,
  CreatePermissionInput,
  CreateRoleInput,
  IdentityManagementRepositoryPort,
  UpdateAvatarOptionInput,
  UpdateBadgeInput,
  UpdatePermissionInput,
  UpdateRoleInput,
} from '../../../../domain/ports/output/identity-management-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  AvatarOptionRow,
  BadgeRow,
  ManagedPermissionRow,
  ManagedRolePermissionRow,
  ManagedRoleRow,
  UserBadgeRow,
} from '../types/bdd-supabase';

@Injectable()
export class IdentityManagementSupabaseRepository implements IdentityManagementRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  findPublicAvatars(): Promise<AvatarOption[]> {
    return this.findAvatars(true);
  }

  findAdminAvatars(): Promise<AvatarOption[]> {
    return this.findAvatars(false);
  }

  async createAvatar(input: CreateAvatarOptionInput): Promise<AvatarOption> {
    if (input.isDefault) await this.clearDefaultAvatars();

    const { data, error } = await this.supabase
      .from('avatar_options')
      .insert(this.avatarPayload(input))
      .select(this.avatarSelect)
      .single<AvatarOptionRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toAvatar(data);
  }

  async updateAvatar(
    id: string,
    input: UpdateAvatarOptionInput,
  ): Promise<AvatarOption> {
    if (input.isDefault) await this.clearDefaultAvatars(id);

    const { data, error } = await this.supabase
      .from('avatar_options')
      .update(this.avatarPayload(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.avatarSelect)
      .single<AvatarOptionRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toAvatar(data);
  }

  deleteAvatar(id: string): Promise<void> {
    return this.softDelete('avatar_options', id);
  }

  findPublicBadges(): Promise<Badge[]> {
    return this.findBadges(true);
  }

  findAdminBadges(): Promise<Badge[]> {
    return this.findBadges(false);
  }

  async createBadge(input: CreateBadgeInput): Promise<Badge> {
    const { data, error } = await this.supabase
      .from('badges')
      .insert(this.badgePayload(input))
      .select(this.badgeSelect)
      .single<BadgeRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toBadge(data);
  }

  async updateBadge(id: string, input: UpdateBadgeInput): Promise<Badge> {
    const { data, error } = await this.supabase
      .from('badges')
      .update(this.badgePayload(input))
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.badgeSelect)
      .single<BadgeRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toBadge(data);
  }

  deleteBadge(id: string): Promise<void> {
    return this.softDelete('badges', id);
  }

  async findUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await this.supabase
      .from('user_badges')
      .select(`${this.userBadgeSelect}, badges (${this.badgeSelect})`)
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false })
      .returns<UserBadgeRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toUserBadge(row));
  }

  async assignUserBadge(input: AssignUserBadgeInput): Promise<UserBadge> {
    const { data, error } = await this.supabase
      .from('user_badges')
      .insert({
        user_id: input.userId,
        badge_id: input.badgeId,
        source_module: input.sourceModule,
        source_id: input.sourceId,
        awarded_by: input.awardedBy,
      })
      .select(`${this.userBadgeSelect}, badges (${this.badgeSelect})`)
      .single<UserBadgeRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toUserBadge(data);
  }

  async removeUserBadge(userBadgeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_badges')
      .delete()
      .eq('id', userBadgeId);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async findRoles(): Promise<ManagedRole[]> {
    const { data, error } = await this.supabase
      .from('roles')
      .select(this.roleSelect)
      .order('created_at', { ascending: true })
      .returns<ManagedRoleRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toRole(row));
  }

  async createRole(input: CreateRoleInput): Promise<ManagedRole> {
    const { data, error } = await this.supabase
      .from('roles')
      .insert({
        key: input.key,
        name: input.name,
        description: input.description,
        is_internal: input.isInternal,
      })
      .select(this.roleSelect)
      .single<ManagedRoleRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toRole(data);
  }

  async updateRole(key: string, input: UpdateRoleInput): Promise<ManagedRole> {
    const { data, error } = await this.supabase
      .from('roles')
      .update({
        name: input.name,
        description: input.description,
        is_internal: input.isInternal,
      })
      .eq('key', key)
      .select(this.roleSelect)
      .single<ManagedRoleRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toRole(data);
  }

  async deleteRole(key: string): Promise<void> {
    const { error } = await this.supabase.from('roles').delete().eq('key', key);
    if (error) throw new InternalServerErrorException(error.message);
  }

  async findPermissions(): Promise<ManagedPermission[]> {
    const { data, error } = await this.supabase
      .from('permissions')
      .select(this.permissionSelect)
      .order('module', { ascending: true })
      .returns<ManagedPermissionRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toPermission(row));
  }

  async createPermission(
    input: CreatePermissionInput,
  ): Promise<ManagedPermission> {
    const { data, error } = await this.supabase
      .from('permissions')
      .insert(input)
      .select(this.permissionSelect)
      .single<ManagedPermissionRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toPermission(data);
  }

  async updatePermission(
    key: string,
    input: UpdatePermissionInput,
  ): Promise<ManagedPermission> {
    const { data, error } = await this.supabase
      .from('permissions')
      .update(input)
      .eq('key', key)
      .select(this.permissionSelect)
      .single<ManagedPermissionRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toPermission(data);
  }

  async deletePermission(key: string): Promise<void> {
    const { error } = await this.supabase
      .from('permissions')
      .delete()
      .eq('key', key);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async findRolePermissions(
    roleKey: string,
  ): Promise<RolePermissionAssignment[]> {
    const { data, error } = await this.supabase
      .from('role_permissions')
      .select(
        `${this.rolePermissionSelect}, permissions (${this.permissionSelect})`,
      )
      .eq('role_key', roleKey)
      .returns<ManagedRolePermissionRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toRolePermission(row));
  }

  async assignPermissionToRole(
    roleKey: string,
    permissionKey: string,
  ): Promise<RolePermissionAssignment> {
    const { data, error } = await this.supabase
      .from('role_permissions')
      .insert({
        role_key: roleKey,
        permission_key: permissionKey,
      })
      .select(
        `${this.rolePermissionSelect}, permissions (${this.permissionSelect})`,
      )
      .single<ManagedRolePermissionRow>();

    if (error) throw new InternalServerErrorException(error.message);
    return this.toRolePermission(data);
  }

  async removePermissionFromRole(
    roleKey: string,
    permissionKey: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('role_permissions')
      .delete()
      .eq('role_key', roleKey)
      .eq('permission_key', permissionKey);

    if (error) throw new InternalServerErrorException(error.message);
  }

  private async findAvatars(publicOnly: boolean): Promise<AvatarOption[]> {
    let query = this.supabase
      .from('avatar_options')
      .select(this.avatarSelect)
      .is('deleted_at', null);

    if (publicOnly) query = query.eq('is_active', true);

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<AvatarOptionRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toAvatar(row));
  }

  private async findBadges(publicOnly: boolean): Promise<Badge[]> {
    let query = this.supabase
      .from('badges')
      .select(this.badgeSelect)
      .is('deleted_at', null);

    if (publicOnly) query = query.eq('is_active', true);

    const { data, error } = await query
      .order('order_index', { ascending: true })
      .returns<BadgeRow[]>();

    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []).map((row) => this.toBadge(row));
  }

  private async clearDefaultAvatars(exceptId?: string): Promise<void> {
    let query = this.supabase
      .from('avatar_options')
      .update({ is_default: false })
      .eq('is_default', true)
      .is('deleted_at', null);

    if (exceptId) query = query.neq('id', exceptId);

    const { error } = await query;
    if (error) throw new InternalServerErrorException(error.message);
  }

  private async softDelete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) throw new InternalServerErrorException(error.message);
  }

  private avatarPayload(
    input: CreateAvatarOptionInput | UpdateAvatarOptionInput,
  ) {
    return {
      key: input.key,
      name: input.name,
      image_url: input.imageUrl,
      is_default: input.isDefault,
      is_active: input.isActive,
      order_index: input.orderIndex,
    };
  }

  private badgePayload(input: CreateBadgeInput | UpdateBadgeInput) {
    return {
      key: input.key,
      name: input.name,
      description: input.description,
      icon: input.icon,
      is_active: input.isActive,
      order_index: input.orderIndex,
    };
  }

  private toAvatar(row: AvatarOptionRow): AvatarOption {
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      imageUrl: row.image_url,
      isDefault: row.is_default,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toBadge(row: BadgeRow): Badge {
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      description: row.description,
      icon: row.icon,
      isActive: row.is_active,
      orderIndex: row.order_index,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private toUserBadge(row: UserBadgeRow): UserBadge {
    return {
      id: row.id,
      userId: row.user_id,
      badgeId: row.badge_id,
      sourceModule: row.source_module,
      sourceId: row.source_id,
      awardedAt: row.awarded_at,
      awardedBy: row.awarded_by,
      badge: row.badges ? this.toBadge(row.badges) : null,
    };
  }

  private toRole(row: ManagedRoleRow): ManagedRole {
    return {
      key: row.key,
      name: row.name,
      description: row.description,
      isInternal: row.is_internal,
      createdAt: row.created_at,
    };
  }

  private toPermission(row: ManagedPermissionRow): ManagedPermission {
    return {
      key: row.key,
      module: row.module,
      description: row.description,
      createdAt: row.created_at,
    };
  }

  private toRolePermission(
    row: ManagedRolePermissionRow,
  ): RolePermissionAssignment {
    return {
      roleKey: row.role_key,
      permissionKey: row.permission_key,
      createdAt: row.created_at,
      permission: row.permissions ? this.toPermission(row.permissions) : null,
    };
  }

  private readonly avatarSelect =
    'id, key, name, image_url, is_default, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly badgeSelect =
    'id, key, name, description, icon, is_active, order_index, created_at, updated_at, deleted_at';
  private readonly userBadgeSelect =
    'id, user_id, badge_id, source_module, source_id, awarded_at, awarded_by';
  private readonly roleSelect =
    'key, name, description, is_internal, created_at';
  private readonly permissionSelect = 'key, module, description, created_at';
  private readonly rolePermissionSelect =
    'role_key, permission_key, created_at';
}
