import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateOperatorUseCase } from './application/use-cases/admin/create-operator';
import { GetCurrentUserUseCase } from './application/use-cases/auth/get-current-user';
import { LoginUserUseCase } from './application/use-cases/auth/login-user';
import { RegisterUserUseCase } from './application/use-cases/auth/register-user';
import { AUTH_REPOSITORY } from './domain/ports/output/auth-repository';
import { USER_REPOSITORY } from './domain/ports/output/user-repository';
import { AdminUsersController } from './infrastructure/controllers/admin/users';
import { AuthController } from './infrastructure/controllers/auth';
import { RolesPermissionsGuard } from './infrastructure/http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from './infrastructure/http/auth/guards/supabase-auth';
import { AuthSupabaseRepository } from './infrastructure/persistence/supabase/repositories/auth-supabase';
import { SupabaseModule } from './infrastructure/persistence/supabase/supabase.module';
import { UserSupabaseRepository } from './infrastructure/persistence/supabase/repositories/user-supabase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
  ],
  controllers: [AuthController, AdminUsersController],
  providers: [
    CreateOperatorUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
    SupabaseAuthGuard,
    RolesPermissionsGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthSupabaseRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserSupabaseRepository,
    },
  ],
})
export class AppModule {}
