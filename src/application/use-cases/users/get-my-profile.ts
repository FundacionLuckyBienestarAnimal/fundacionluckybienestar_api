import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from '../../../domain/models/users/profile';
import { USER_REPOSITORY } from '../../../domain/ports/output/user-repository';
import type { UserRepositoryPort } from '../../../domain/ports/output/user-repository';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  execute(userId: string): Promise<Profile> {
    return this.userRepository.findProfileByUserId(userId);
  }
}
