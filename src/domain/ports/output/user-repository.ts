import { CurrentUser } from '../../models/current-user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  findCurrentUserById(user: {
    id: string;
    email: string | null;
  }): Promise<CurrentUser>;
}
