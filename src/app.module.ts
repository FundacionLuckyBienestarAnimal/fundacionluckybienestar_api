import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateOperatorUseCase } from './application/use-cases/admin/create-operator';
import { GetCurrentUserUseCase } from './application/use-cases/auth/get-current-user';
import { LoginUserUseCase } from './application/use-cases/auth/login-user';
import { RegisterUserUseCase } from './application/use-cases/auth/register-user';
import { CreateHeroCardUseCase } from './application/use-cases/landing/create-hero-card';
import { CreateLandingImpactBlockUseCase } from './application/use-cases/landing/create-impact-block';
import { CreateLandingInfoCardUseCase } from './application/use-cases/landing/create-info-card';
import { CreateLandingSectionUseCase } from './application/use-cases/landing/create-section';
import { DeleteHeroCardUseCase } from './application/use-cases/landing/delete-hero-card';
import { DeleteLandingImpactBlockUseCase } from './application/use-cases/landing/delete-impact-block';
import { DeleteLandingInfoCardUseCase } from './application/use-cases/landing/delete-info-card';
import { DeleteLandingSectionUseCase } from './application/use-cases/landing/delete-section';
import { GetAdminLandingUseCase } from './application/use-cases/landing/get-admin-landing';
import { GetPublicLandingUseCase } from './application/use-cases/landing/get-public-landing';
import { UpdateHeroCardUseCase } from './application/use-cases/landing/update-hero-card';
import { UpdateLandingImpactBlockUseCase } from './application/use-cases/landing/update-impact-block';
import { UpdateLandingInfoCardUseCase } from './application/use-cases/landing/update-info-card';
import { UpdateLandingSectionUseCase } from './application/use-cases/landing/update-section';
import { GetMyProfileUseCase } from './application/use-cases/users/get-my-profile';
import { UpdateMyProfileUseCase } from './application/use-cases/users/update-my-profile';
import { AUTH_REPOSITORY } from './domain/ports/output/auth-repository';
import { LANDING_REPOSITORY } from './domain/ports/output/landing-repository';
import { USER_REPOSITORY } from './domain/ports/output/user-repository';
import { AdminLandingController } from './infrastructure/controllers/admin/landing';
import { AdminUsersController } from './infrastructure/controllers/admin/users';
import { AuthController } from './infrastructure/controllers/auth';
import { PublicLandingController } from './infrastructure/controllers/public/landing';
import { UsersController } from './infrastructure/controllers/users';
import { RolesPermissionsGuard } from './infrastructure/http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from './infrastructure/http/auth/guards/supabase-auth';
import { AuthSupabaseRepository } from './infrastructure/persistence/supabase/repositories/auth-supabase';
import { LandingSupabaseRepository } from './infrastructure/persistence/supabase/repositories/landing-supabase';
import { SupabaseModule } from './infrastructure/persistence/supabase/supabase.module';
import { UserSupabaseRepository } from './infrastructure/persistence/supabase/repositories/user-supabase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
  ],
  controllers: [
    AuthController,
    AdminUsersController,
    UsersController,
    PublicLandingController,
    AdminLandingController,
  ],
  providers: [
    CreateOperatorUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
    GetMyProfileUseCase,
    UpdateMyProfileUseCase,
    GetPublicLandingUseCase,
    GetAdminLandingUseCase,
    CreateLandingSectionUseCase,
    CreateHeroCardUseCase,
    CreateLandingImpactBlockUseCase,
    CreateLandingInfoCardUseCase,
    UpdateLandingSectionUseCase,
    UpdateHeroCardUseCase,
    UpdateLandingImpactBlockUseCase,
    UpdateLandingInfoCardUseCase,
    DeleteLandingSectionUseCase,
    DeleteHeroCardUseCase,
    DeleteLandingImpactBlockUseCase,
    DeleteLandingInfoCardUseCase,
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
    {
      provide: LANDING_REPOSITORY,
      useClass: LandingSupabaseRepository,
    },
  ],
})
export class AppModule {}
