import { Inject, Injectable } from '@nestjs/common';
import type { RegisteredUser } from '../../../domain/models/auth/registered-user';
import { AUTH_REPOSITORY } from '../../../domain/ports/output/auth-repository';
import type {
  AuthRepositoryPort,
  CreateOperatorInput,
} from '../../../domain/ports/output/auth-repository';

@Injectable()
export class CreateOperatorUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
  ) {}

  execute(input: CreateOperatorInput): Promise<RegisteredUser> {
    return this.authRepository.createOperator(input);
  }
}
