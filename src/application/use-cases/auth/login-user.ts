import { Inject, Injectable } from '@nestjs/common';
import { AuthSession } from '../../../domain/models/auth/auth-session';
import { AUTH_REPOSITORY } from '../../../domain/ports/output/auth-repository';
import type {
  AuthRepositoryPort,
  LoginUserInput,
} from '../../../domain/ports/output/auth-repository';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
  ) {}

  execute(input: LoginUserInput): Promise<AuthSession> {
    return this.authRepository.login(input);
  }
}
