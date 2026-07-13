import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from '../../../domain/models/users/profile';
import {
  USER_REPOSITORY,
  type UpdateProfileInput,
} from '../../../domain/ports/output/user-repository';
import type { UserRepositoryPort } from '../../../domain/ports/output/user-repository';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  execute(userId: string, input: UpdateProfileInput): Promise<Profile> {
    return this.userRepository.updateProfileByUserId(userId, input);
  }
}
