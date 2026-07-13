import { Inject, Injectable } from '@nestjs/common';
import { RegisteredUser } from '../../../domain/models/auth/registered-user';
import { AUTH_REPOSITORY } from '../../../domain/ports/output/auth-repository';
import type {
  AuthRepositoryPort,
  RegisterUserInput,
} from '../../../domain/ports/output/auth-repository';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
  ) {}

  execute(input: RegisterUserInput): Promise<RegisteredUser> {
    return this.authRepository.register(input);
  }
}
