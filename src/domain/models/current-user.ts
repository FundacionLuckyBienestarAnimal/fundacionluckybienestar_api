import { Permission } from './permission';
import { Profile } from './profile';
import { Role } from './role';
import { AuthUser } from './auth-user';

export interface CurrentUser extends AuthUser {
  profile: Profile | null;
  roles: Role[];
  permissions: Permission[];
}
