import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user';
import { USER_REPOSITORY } from './domain/ports/output/user-repository';
import { AuthController } from './infrastructure/controllers/auth';
import { RolesPermissionsGuard } from './infrastructure/http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from './infrastructure/http/auth/guards/supabase-auth';
import { SupabaseModule } from './infrastructure/persistence/supabase/supabase.module';
import { UserSupabaseRepository } from './infrastructure/persistence/supabase/repositories/user-supabase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    GetCurrentUserUseCase,
    SupabaseAuthGuard,
    RolesPermissionsGuard,
    {
      provide: USER_REPOSITORY,
      useClass: UserSupabaseRepository,
    },
  ],
})
export class AppModule {}
