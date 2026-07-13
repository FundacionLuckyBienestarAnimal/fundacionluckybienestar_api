import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from '../../application/dto/auth/login';
import { RegisterDto } from '../../application/dto/auth/register';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user';
import type { AuthenticatedUser } from '../../domain/models/auth/authenticated-user';
import { AuthSession } from '../../domain/models/auth/auth-session';
import { RegisteredUser } from '../../domain/models/auth/registered-user';
import { CurrentUser as CurrentUserModel } from '../../domain/models/users/current-user';
import { CurrentUser } from '../http/auth/decorators/current-user';
import { SupabaseAuthGuard } from '../http/auth/guards/supabase-auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto): Promise<RegisteredUser> {
    return this.registerUserUseCase.execute(body);
  }

  @Post('login')
  login(@Body() body: LoginDto): Promise<AuthSession> {
    return this.loginUserUseCase.execute(body);
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): Promise<CurrentUserModel> {
    return this.getCurrentUserUseCase.execute(user);
  }
}
