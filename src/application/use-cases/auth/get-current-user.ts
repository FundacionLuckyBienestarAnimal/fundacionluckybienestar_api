import { Inject, Injectable } from '@nestjs/common';
import { CurrentUser } from '../../../domain/models/users/current-user';
import { USER_REPOSITORY } from '../../../domain/ports/output/user-repository';
import type { UserRepositoryPort } from '../../../domain/ports/output/user-repository';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  execute(user: { id: string; email: string | null }): Promise<CurrentUser> {
    return this.userRepository.findCurrentUserById(user);
  }
}
