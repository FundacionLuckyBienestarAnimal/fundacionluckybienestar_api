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
import { DeleteMediaUseCase } from './application/use-cases/media/delete-media';
import { GetMediaUseCase } from './application/use-cases/media/get-media';
import { UpdateMediaUseCase } from './application/use-cases/media/update-media';
import { UploadMediaUseCase } from './application/use-cases/media/upload-media';
import { CreatePublicationCategoryUseCase } from './application/use-cases/publications/create-category';
import { CreatePublicationUseCase } from './application/use-cases/publications/create-publication';
import { DeletePublicationCategoryUseCase } from './application/use-cases/publications/delete-category';
import { DeletePublicationUseCase } from './application/use-cases/publications/delete-publication';
import { GetAdminPublicationCategoriesUseCase } from './application/use-cases/publications/get-admin-categories';
import { GetAdminPublicationsUseCase } from './application/use-cases/publications/get-admin-publications';
import { GetPublicPublicationCategoriesUseCase } from './application/use-cases/publications/get-public-categories';
import { GetPublicPublicationBySlugUseCase } from './application/use-cases/publications/get-public-publication-by-slug';
import { GetPublicPublicationsUseCase } from './application/use-cases/publications/get-public-publications';
import { UpdatePublicationCategoryUseCase } from './application/use-cases/publications/update-category';
import { UpdatePublicationUseCase } from './application/use-cases/publications/update-publication';
import { GetMyProfileUseCase } from './application/use-cases/users/get-my-profile';
import { UpdateMyProfileUseCase } from './application/use-cases/users/update-my-profile';
import { AUTH_REPOSITORY } from './domain/ports/output/auth-repository';
import { LANDING_REPOSITORY } from './domain/ports/output/landing-repository';
import { MEDIA_REPOSITORY } from './domain/ports/output/media-repository';
import { PUBLICATION_REPOSITORY } from './domain/ports/output/publication-repository';
import { USER_REPOSITORY } from './domain/ports/output/user-repository';
import { AdminLandingController } from './infrastructure/controllers/admin/landing';
import { AdminMediaController } from './infrastructure/controllers/admin/media';
import { AdminPublicationsController } from './infrastructure/controllers/admin/publications';
import { AdminUsersController } from './infrastructure/controllers/admin/users';
import { AuthController } from './infrastructure/controllers/auth';
import { PublicLandingController } from './infrastructure/controllers/public/landing';
import { PublicPublicationsController } from './infrastructure/controllers/public/publications';
import { UsersController } from './infrastructure/controllers/users';
import { RolesPermissionsGuard } from './infrastructure/http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from './infrastructure/http/auth/guards/supabase-auth';
import { AuthSupabaseRepository } from './infrastructure/persistence/supabase/repositories/auth-supabase';
import { LandingSupabaseRepository } from './infrastructure/persistence/supabase/repositories/landing-supabase';
import { MediaSupabaseRepository } from './infrastructure/persistence/supabase/repositories/media-supabase';
import { PublicationSupabaseRepository } from './infrastructure/persistence/supabase/repositories/publication-supabase';
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
    PublicPublicationsController,
    AdminPublicationsController,
    AdminMediaController,
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
    GetMediaUseCase,
    UploadMediaUseCase,
    UpdateMediaUseCase,
    DeleteMediaUseCase,
    GetPublicPublicationCategoriesUseCase,
    GetAdminPublicationCategoriesUseCase,
    GetPublicPublicationsUseCase,
    GetAdminPublicationsUseCase,
    GetPublicPublicationBySlugUseCase,
    CreatePublicationCategoryUseCase,
    UpdatePublicationCategoryUseCase,
    DeletePublicationCategoryUseCase,
    CreatePublicationUseCase,
    UpdatePublicationUseCase,
    DeletePublicationUseCase,
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
    {
      provide: PUBLICATION_REPOSITORY,
      useClass: PublicationSupabaseRepository,
    },
    {
      provide: MEDIA_REPOSITORY,
      useClass: MediaSupabaseRepository,
    },
  ],
})
export class AppModule {}
