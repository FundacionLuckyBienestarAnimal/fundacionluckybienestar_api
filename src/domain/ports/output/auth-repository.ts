import type { AuthSession } from '../../models/auth/auth-session';
import type { RegisteredUser } from '../../models/auth/registered-user';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface RegisterUserInput {
  email: string;
  password: string;
  firstNames?: string;
  lastNames?: string;
  phone?: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface CreateOperatorInput {
  email: string;
  password: string;
  firstNames?: string;
  lastNames?: string;
  phone?: string;
  assignedBy: string;
}

export interface AuthRepositoryPort {
  register(input: RegisterUserInput): Promise<RegisteredUser>;
  login(input: LoginUserInput): Promise<AuthSession>;
  createOperator(input: CreateOperatorInput): Promise<RegisteredUser>;
}
