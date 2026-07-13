import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type { AuthSession } from '../../../../domain/models/auth/auth-session';
import type { RegisteredUser } from '../../../../domain/models/auth/registered-user';
import type {
  AuthRepositoryPort,
  CreateOperatorInput,
  LoginUserInput,
  RegisterUserInput,
} from '../../../../domain/ports/output/auth-repository';
import {
  SUPABASE_ADMIN_CLIENT,
  SUPABASE_PUBLIC_CLIENT,
} from '../supabase.tokens';

type ProfileInput = {
  firstNames?: string;
  lastNames?: string;
  phone?: string;
};

@Injectable()
export class AuthSupabaseRepository implements AuthRepositoryPort {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabaseAdmin: SupabaseClient,
    @Inject(SUPABASE_PUBLIC_CLIENT)
    private readonly supabasePublic: SupabaseClient,
  ) {}

  async register(input: RegisterUserInput): Promise<RegisteredUser> {
    const user = await this.createAuthUser(input);

    await this.ensureProfile(user.id, input, 'public');
    await this.ensureUserRole(user.id, 'public_user', null);

    return user;
  }

  async createOperator(input: CreateOperatorInput): Promise<RegisteredUser> {
    const user = await this.createAuthUser(input);

    await this.ensureProfile(user.id, input, 'staff');
    await this.ensureUserRole(user.id, 'operator', input.assignedBy);

    return user;
  }

  async login(input: LoginUserInput): Promise<AuthSession> {
    const { data, error } = await this.supabasePublic.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session || !data.user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      tokenType: data.session.token_type,
      expiresIn: data.session.expires_in,
      expiresAt: data.session.expires_at ?? null,
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
      },
    };
  }

  private async createAuthUser(input: {
    email: string;
    password: string;
    firstNames?: string;
    lastNames?: string;
    phone?: string;
  }): Promise<RegisteredUser> {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_names: input.firstNames ?? null,
        last_names: input.lastNames ?? null,
        phone: input.phone ?? null,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data.user) {
      throw new InternalServerErrorException('User was not created');
    }

    return {
      id: data.user.id,
      email: data.user.email ?? null,
    };
  }

  private async ensureProfile(
    userId: string,
    input: ProfileInput,
    userType: 'public' | 'staff',
  ): Promise<void> {
    const { error } = await this.supabaseAdmin.from('profiles').upsert(
      {
        id: userId,
        first_names: input.firstNames ?? null,
        last_names: input.lastNames ?? null,
        phone: input.phone ?? null,
        status: 'active',
        user_type: userType,
      },
      {
        onConflict: 'id',
      },
    );

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async ensureUserRole(
    userId: string,
    roleKey: 'public_user' | 'operator',
    assignedBy: string | null,
  ): Promise<void> {
    const { error } = await this.supabaseAdmin.from('user_roles').upsert(
      {
        user_id: userId,
        role_key: roleKey,
        assigned_by: assignedBy,
        is_active: true,
      },
      {
        onConflict: 'user_id,role_key',
      },
    );

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
