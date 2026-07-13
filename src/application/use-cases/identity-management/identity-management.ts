import { Inject, Injectable } from '@nestjs/common';
import type {
  AvatarOption,
  Badge,
  ManagedPermission,
  ManagedRole,
  RolePermissionAssignment,
  UserBadge,
} from '../../../domain/models/access-control/identity-management';
import {
  IDENTITY_MANAGEMENT_REPOSITORY,
  type AssignUserBadgeInput,
  type CreateAvatarOptionInput,
  type CreateBadgeInput,
  type CreatePermissionInput,
  type CreateRoleInput,
  type IdentityManagementRepositoryPort,
  type UpdateAvatarOptionInput,
  type UpdateBadgeInput,
  type UpdatePermissionInput,
  type UpdateRoleInput,
} from '../../../domain/ports/output/identity-management-repository';

@Injectable()
export class GetPublicAvatarsUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<AvatarOption[]> {
    return this.repository.findPublicAvatars();
  }
}

@Injectable()
export class GetAdminAvatarsUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<AvatarOption[]> {
    return this.repository.findAdminAvatars();
  }
}

@Injectable()
export class CreateAvatarUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(input: CreateAvatarOptionInput): Promise<AvatarOption> {
    return this.repository.createAvatar(input);
  }
}

@Injectable()
export class UpdateAvatarUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(id: string, input: UpdateAvatarOptionInput): Promise<AvatarOption> {
    return this.repository.updateAvatar(id, input);
  }
}

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.repository.deleteAvatar(id);
  }
}

@Injectable()
export class GetPublicBadgesUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<Badge[]> {
    return this.repository.findPublicBadges();
  }
}

@Injectable()
export class GetAdminBadgesUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<Badge[]> {
    return this.repository.findAdminBadges();
  }
}

@Injectable()
export class CreateBadgeUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(input: CreateBadgeInput): Promise<Badge> {
    return this.repository.createBadge(input);
  }
}

@Injectable()
export class UpdateBadgeUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(id: string, input: UpdateBadgeInput): Promise<Badge> {
    return this.repository.updateBadge(id, input);
  }
}

@Injectable()
export class DeleteBadgeUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(id: string): Promise<void> {
    return this.repository.deleteBadge(id);
  }
}

@Injectable()
export class GetUserBadgesUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(userId: string): Promise<UserBadge[]> {
    return this.repository.findUserBadges(userId);
  }
}

@Injectable()
export class AssignUserBadgeUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(input: AssignUserBadgeInput): Promise<UserBadge> {
    return this.repository.assignUserBadge(input);
  }
}

@Injectable()
export class RemoveUserBadgeUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(userBadgeId: string): Promise<void> {
    return this.repository.removeUserBadge(userBadgeId);
  }
}

@Injectable()
export class GetRolesUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<ManagedRole[]> {
    return this.repository.findRoles();
  }
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(input: CreateRoleInput): Promise<ManagedRole> {
    return this.repository.createRole(input);
  }
}

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(key: string, input: UpdateRoleInput): Promise<ManagedRole> {
    return this.repository.updateRole(key, input);
  }
}

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(key: string): Promise<void> {
    return this.repository.deleteRole(key);
  }
}

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(): Promise<ManagedPermission[]> {
    return this.repository.findPermissions();
  }
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(input: CreatePermissionInput): Promise<ManagedPermission> {
    return this.repository.createPermission(input);
  }
}

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(
    key: string,
    input: UpdatePermissionInput,
  ): Promise<ManagedPermission> {
    return this.repository.updatePermission(key, input);
  }
}

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(key: string): Promise<void> {
    return this.repository.deletePermission(key);
  }
}

@Injectable()
export class GetRolePermissionsUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(roleKey: string): Promise<RolePermissionAssignment[]> {
    return this.repository.findRolePermissions(roleKey);
  }
}

@Injectable()
export class AssignRolePermissionUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(
    roleKey: string,
    permissionKey: string,
  ): Promise<RolePermissionAssignment> {
    return this.repository.assignPermissionToRole(roleKey, permissionKey);
  }
}

@Injectable()
export class RemoveRolePermissionUseCase {
  constructor(
    @Inject(IDENTITY_MANAGEMENT_REPOSITORY)
    private readonly repository: IdentityManagementRepositoryPort,
  ) {}

  execute(roleKey: string, permissionKey: string): Promise<void> {
    return this.repository.removePermissionFromRole(roleKey, permissionKey);
  }
}
