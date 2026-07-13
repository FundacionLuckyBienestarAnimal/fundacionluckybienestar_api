import { CurrentUser } from '../../models/users/current-user';
import { Profile } from '../../models/users/profile';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UpdateProfileInput {
  avatarId?: string;
  firstNames?: string;
  lastNames?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  housingSector?: string;
}

export interface UserRepositoryPort {
  findCurrentUserById(user: {
    id: string;
    email: string | null;
  }): Promise<CurrentUser>;
  findProfileByUserId(userId: string): Promise<Profile>;
  updateProfileByUserId(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<Profile>;
}
