import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateAvatarOptionDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsUrl({ require_tld: false })
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class UpdateAvatarOptionDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class CreateBadgeDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class UpdateBadgeDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class AssignUserBadgeDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  badgeId: string;

  @IsOptional()
  @IsString()
  sourceModule?: string;

  @IsOptional()
  @IsUUID()
  sourceId?: string;
}

export class CreateRoleDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class CreatePermissionDto {
  @IsString()
  key: string;

  @IsString()
  module: string;

  @IsString()
  description: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignRolePermissionDto {
  @IsString()
  permissionKey: string;
}
