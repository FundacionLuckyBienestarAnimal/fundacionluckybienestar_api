import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Permission } from '../../../../domain/models/access-control/permission';
import { Role } from '../../../../domain/models/access-control/role';
import { CurrentUser } from '../../../../domain/models/users/current-user';
import { Profile } from '../../../../domain/models/users/profile';
import {
  UpdateProfileInput,
  UserRepositoryPort,
} from '../../../../domain/ports/output/user-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type {
  ProfileRow,
  RolePermissionRow,
  UserRoleRow,
} from '../types/bdd-supabase';

@Injectable()
export class UserSupabaseRepository implements UserRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findCurrentUserById(user: {
    id: string;
    email: string | null;
  }): Promise<CurrentUser> {
    const profile = await this.findProfileById(user.id);

    if (!profile) {
      return {
        id: user.id,
        email: user.email,
        profile: null,
        roles: [],
        permissions: [],
      };
    }

    const roles = await this.findRolesByUserId(user.id);

    const permissions = await this.findPermissionsByRoleKeys(
      roles.map((role) => role.key),
    );

    return {
      id: user.id,
      email: user.email,
      profile,
      roles,
      permissions,
    };
  }

  async findProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.findProfileById(userId);

    if (!profile) {
      throw new InternalServerErrorException('Profile not found');
    }

    return profile;
  }

  async updateProfileByUserId(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({
        avatar_id: input.avatarId,
        first_names: input.firstNames,
        last_names: input.lastNames,
        phone: input.phone,
        birth_date: input.birthDate,
        address: input.address,
        housing_sector: input.housingSector,
      })
      .eq('id', userId)
      .is('deleted_at', null)
      .select(
        'id, avatar_id, first_names, last_names, phone, birth_date, address, housing_sector, status, user_type, created_at, updated_at',
      )
      .single<ProfileRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toProfile(data);
  }

  private async findProfileById(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(
        'id, avatar_id, first_names, last_names, phone, birth_date, address, housing_sector, status, user_type, created_at, updated_at',
      )
      .eq('id', userId)
      .is('deleted_at', null)
      .maybeSingle<ProfileRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data ? this.toProfile(data) : null;
  }

  private async findRolesByUserId(userId: string): Promise<Role[]> {
    const { data, error } = await this.supabase
      .from('user_roles')
      .select(
        'role_key, roles(key, name, description, is_internal, created_at)',
      )
      .eq('user_id', userId)
      .eq('is_active', true)
      .returns<UserRoleRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? [])
      .map((row) => row.roles)
      .filter((role): role is NonNullable<UserRoleRow['roles']> =>
        Boolean(role),
      )
      .map((role) => ({
        key: role.key,
        name: role.name,
        description: role.description,
        isInternal: role.is_internal,
        createdAt: role.created_at,
      }));
  }

  private async findPermissionsByRoleKeys(
    roleKeys: string[],
  ): Promise<Permission[]> {
    if (roleKeys.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('role_permissions')
      .select('role_key, permissions(key, module, description, created_at)')
      .in('role_key', roleKeys)
      .returns<RolePermissionRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const permissions = new Map<string, Permission>();

    for (const row of data ?? []) {
      if (!row.permissions) {
        continue;
      }

      permissions.set(row.permissions.key, {
        key: row.permissions.key,
        module: row.permissions.module,
        description: row.permissions.description,
        createdAt: row.permissions.created_at,
      });
    }

    return [...permissions.values()];
  }

  private toProfile(row: ProfileRow): Profile {
    return {
      id: row.id,
      avatarId: row.avatar_id,
      firstNames: row.first_names,
      lastNames: row.last_names,
      phone: row.phone,
      birthDate: row.birth_date,
      address: row.address,
      housingSector: row.housing_sector,
      status: row.status,
      userType: row.user_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
