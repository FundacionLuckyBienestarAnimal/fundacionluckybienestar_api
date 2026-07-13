import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AssignRolePermissionDto,
  AssignUserBadgeDto,
  CreateAvatarOptionDto,
  CreateBadgeDto,
  CreatePermissionDto,
  CreateRoleDto,
  UpdateAvatarOptionDto,
  UpdateBadgeDto,
  UpdatePermissionDto,
  UpdateRoleDto,
} from '../../../application/dto/identity-management/identity-management';
import {
  AssignRolePermissionUseCase,
  AssignUserBadgeUseCase,
  CreateAvatarUseCase,
  CreateBadgeUseCase,
  CreatePermissionUseCase,
  CreateRoleUseCase,
  DeleteAvatarUseCase,
  DeleteBadgeUseCase,
  DeletePermissionUseCase,
  DeleteRoleUseCase,
  GetAdminAvatarsUseCase,
  GetAdminBadgesUseCase,
  GetPermissionsUseCase,
  GetRolePermissionsUseCase,
  GetRolesUseCase,
  GetUserBadgesUseCase,
  RemoveRolePermissionUseCase,
  RemoveUserBadgeUseCase,
  UpdateAvatarUseCase,
  UpdateBadgeUseCase,
  UpdatePermissionUseCase,
  UpdateRoleUseCase,
} from '../../../application/use-cases/identity-management/identity-management';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type {
  AvatarOption,
  Badge,
  ManagedPermission,
  ManagedRole,
  RolePermissionAssignment,
  UserBadge,
} from '../../../domain/models/access-control/identity-management';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Roles } from '../../http/auth/decorators/roles';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/identity')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Roles('admin')
export class AdminIdentityManagementController {
  constructor(
    private readonly getAdminAvatarsUseCase: GetAdminAvatarsUseCase,
    private readonly createAvatarUseCase: CreateAvatarUseCase,
    private readonly updateAvatarUseCase: UpdateAvatarUseCase,
    private readonly deleteAvatarUseCase: DeleteAvatarUseCase,
    private readonly getAdminBadgesUseCase: GetAdminBadgesUseCase,
    private readonly createBadgeUseCase: CreateBadgeUseCase,
    private readonly updateBadgeUseCase: UpdateBadgeUseCase,
    private readonly deleteBadgeUseCase: DeleteBadgeUseCase,
    private readonly getUserBadgesUseCase: GetUserBadgesUseCase,
    private readonly assignUserBadgeUseCase: AssignUserBadgeUseCase,
    private readonly removeUserBadgeUseCase: RemoveUserBadgeUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly assignRolePermissionUseCase: AssignRolePermissionUseCase,
    private readonly removeRolePermissionUseCase: RemoveRolePermissionUseCase,
  ) {}

  @Get('avatar-options')
  getAvatars(): Promise<AvatarOption[]> {
    return this.getAdminAvatarsUseCase.execute();
  }

  @Post('avatar-options')
  createAvatar(@Body() body: CreateAvatarOptionDto): Promise<AvatarOption> {
    return this.createAvatarUseCase.execute(body);
  }

  @Patch('avatar-options/:id')
  updateAvatar(
    @Param('id') id: string,
    @Body() body: UpdateAvatarOptionDto,
  ): Promise<AvatarOption> {
    return this.updateAvatarUseCase.execute(id, body);
  }

  @Delete('avatar-options/:id')
  @HttpCode(204)
  deleteAvatar(@Param('id') id: string): Promise<void> {
    return this.deleteAvatarUseCase.execute(id);
  }

  @Get('badges')
  getBadges(): Promise<Badge[]> {
    return this.getAdminBadgesUseCase.execute();
  }

  @Post('badges')
  createBadge(@Body() body: CreateBadgeDto): Promise<Badge> {
    return this.createBadgeUseCase.execute(body);
  }

  @Patch('badges/:id')
  updateBadge(
    @Param('id') id: string,
    @Body() body: UpdateBadgeDto,
  ): Promise<Badge> {
    return this.updateBadgeUseCase.execute(id, body);
  }

  @Delete('badges/:id')
  @HttpCode(204)
  deleteBadge(@Param('id') id: string): Promise<void> {
    return this.deleteBadgeUseCase.execute(id);
  }

  @Get('users/:userId/badges')
  getUserBadges(@Param('userId') userId: string): Promise<UserBadge[]> {
    return this.getUserBadgesUseCase.execute(userId);
  }

  @Post('users/badges')
  assignUserBadge(
    @Body() body: AssignUserBadgeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserBadge> {
    return this.assignUserBadgeUseCase.execute({
      ...body,
      awardedBy: user.id,
    });
  }

  @Delete('users/badges/:userBadgeId')
  @HttpCode(204)
  removeUserBadge(@Param('userBadgeId') userBadgeId: string): Promise<void> {
    return this.removeUserBadgeUseCase.execute(userBadgeId);
  }

  @Get('roles')
  getRoles(): Promise<ManagedRole[]> {
    return this.getRolesUseCase.execute();
  }

  @Post('roles')
  createRole(@Body() body: CreateRoleDto): Promise<ManagedRole> {
    return this.createRoleUseCase.execute(body);
  }

  @Patch('roles/:key')
  updateRole(
    @Param('key') key: string,
    @Body() body: UpdateRoleDto,
  ): Promise<ManagedRole> {
    return this.updateRoleUseCase.execute(key, body);
  }

  @Delete('roles/:key')
  @HttpCode(204)
  deleteRole(@Param('key') key: string): Promise<void> {
    return this.deleteRoleUseCase.execute(key);
  }

  @Get('permissions')
  getPermissions(): Promise<ManagedPermission[]> {
    return this.getPermissionsUseCase.execute();
  }

  @Post('permissions')
  createPermission(
    @Body() body: CreatePermissionDto,
  ): Promise<ManagedPermission> {
    return this.createPermissionUseCase.execute(body);
  }

  @Patch('permissions/:key')
  updatePermission(
    @Param('key') key: string,
    @Body() body: UpdatePermissionDto,
  ): Promise<ManagedPermission> {
    return this.updatePermissionUseCase.execute(key, body);
  }

  @Delete('permissions/:key')
  @HttpCode(204)
  deletePermission(@Param('key') key: string): Promise<void> {
    return this.deletePermissionUseCase.execute(key);
  }

  @Get('roles/:roleKey/permissions')
  getRolePermissions(
    @Param('roleKey') roleKey: string,
  ): Promise<RolePermissionAssignment[]> {
    return this.getRolePermissionsUseCase.execute(roleKey);
  }

  @Post('roles/:roleKey/permissions')
  assignRolePermission(
    @Param('roleKey') roleKey: string,
    @Body() body: AssignRolePermissionDto,
  ): Promise<RolePermissionAssignment> {
    return this.assignRolePermissionUseCase.execute(
      roleKey,
      body.permissionKey,
    );
  }

  @Delete('roles/:roleKey/permissions/:permissionKey')
  @HttpCode(204)
  removeRolePermission(
    @Param('roleKey') roleKey: string,
    @Param('permissionKey') permissionKey: string,
  ): Promise<void> {
    return this.removeRolePermissionUseCase.execute(roleKey, permissionKey);
  }
}
