import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user';
import type { AuthenticatedUser } from '../../domain/models/authenticated-user';
import { CurrentUser } from '../http/auth/decorators/current-user';
import { SupabaseAuthGuard } from '../http/auth/guards/supabase-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.getCurrentUserUseCase.execute(user);
  }
}
