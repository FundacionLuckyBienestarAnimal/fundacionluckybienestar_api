import { Permission } from '../access-control/permission';
import { Role } from '../access-control/role';
import { AuthUser } from '../auth/auth-user';
import { Profile } from './profile';

export interface CurrentUser extends AuthUser {
  profile: Profile | null;
  roles: Role[];
  permissions: Permission[];
}
