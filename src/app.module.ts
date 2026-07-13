import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddAnimalCharacteristicUseCase } from './application/use-cases/animals/add-animal-characteristic';
import { AddAnimalImageUseCase } from './application/use-cases/animals/add-animal-image';
import { CreateAnimalUseCase } from './application/use-cases/animals/create-animal';
import { DeleteAnimalCharacteristicUseCase } from './application/use-cases/animals/delete-animal-characteristic';
import { DeleteAnimalImageUseCase } from './application/use-cases/animals/delete-animal-image';
import { DeleteAnimalUseCase } from './application/use-cases/animals/delete-animal';
import { GetAdminAnimalsUseCase } from './application/use-cases/animals/get-admin-animals';
import { GetPublicAnimalBySlugUseCase } from './application/use-cases/animals/get-public-animal-by-slug';
import { GetPublicAnimalsUseCase } from './application/use-cases/animals/get-public-animals';
import { UpdateAnimalCharacteristicUseCase } from './application/use-cases/animals/update-animal-characteristic';
import { UpdateAnimalUseCase } from './application/use-cases/animals/update-animal';
import { CreateAdoptionApplicationUseCase } from './application/use-cases/adoptions/create-adoption-application';
import { CreateHousingTypeUseCase } from './application/use-cases/adoptions/create-housing-type';
import { DeleteHousingTypeUseCase } from './application/use-cases/adoptions/delete-housing-type';
import { GetAdminAdoptionApplicationsUseCase } from './application/use-cases/adoptions/get-admin-adoption-applications';
import { GetAdminHousingTypesUseCase } from './application/use-cases/adoptions/get-admin-housing-types';
import { GetMyAdoptionApplicationsUseCase } from './application/use-cases/adoptions/get-my-adoption-applications';
import { GetPublicHousingTypesUseCase } from './application/use-cases/adoptions/get-public-housing-types';
import { UpdateAdoptionStatusUseCase } from './application/use-cases/adoptions/update-adoption-status';
import { UpdateHousingTypeUseCase } from './application/use-cases/adoptions/update-housing-type';
import { CreateVolunteerApplicationUseCase } from './application/use-cases/volunteers/create-volunteer-application';
import { CreateVolunteerRequirementUseCase } from './application/use-cases/volunteers/create-requirement';
import { DeleteVolunteerRequirementUseCase } from './application/use-cases/volunteers/delete-requirement';
import { GetAdminVolunteerApplicationsUseCase } from './application/use-cases/volunteers/get-admin-volunteer-applications';
import { GetAdminVolunteerRequirementsUseCase } from './application/use-cases/volunteers/get-admin-requirements';
import { GetMyVolunteerApplicationsUseCase } from './application/use-cases/volunteers/get-my-volunteer-applications';
import { GetPublicVolunteerRequirementsUseCase } from './application/use-cases/volunteers/get-public-requirements';
import { GetVolunteerProfilesUseCase } from './application/use-cases/volunteers/get-volunteer-profiles';
import { UpdateVolunteerRequirementUseCase } from './application/use-cases/volunteers/update-requirement';
import { UpdateVolunteerStatusUseCase } from './application/use-cases/volunteers/update-volunteer-status';
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
import { CreateContactInfoUseCase } from './application/use-cases/settings/create-contact-info';
import { CreateFaqItemUseCase } from './application/use-cases/settings/create-faq-item';
import { CreateSocialLinkUseCase } from './application/use-cases/settings/create-social-link';
import { DeleteContactInfoUseCase } from './application/use-cases/settings/delete-contact-info';
import { DeleteFaqItemUseCase } from './application/use-cases/settings/delete-faq-item';
import { DeleteSocialLinkUseCase } from './application/use-cases/settings/delete-social-link';
import { GetAdminContactInfoUseCase } from './application/use-cases/settings/get-admin-contact-info';
import { GetAdminFaqItemsUseCase } from './application/use-cases/settings/get-admin-faq-items';
import { GetAdminSocialLinksUseCase } from './application/use-cases/settings/get-admin-social-links';
import { GetPublicContactInfoUseCase } from './application/use-cases/settings/get-public-contact-info';
import { GetPublicFaqItemsUseCase } from './application/use-cases/settings/get-public-faq-items';
import { GetPublicSocialLinksUseCase } from './application/use-cases/settings/get-public-social-links';
import { UpdateContactInfoUseCase } from './application/use-cases/settings/update-contact-info';
import { UpdateFaqItemUseCase } from './application/use-cases/settings/update-faq-item';
import { UpdateSocialLinkUseCase } from './application/use-cases/settings/update-social-link';
import { GetMyProfileUseCase } from './application/use-cases/users/get-my-profile';
import { UpdateMyProfileUseCase } from './application/use-cases/users/update-my-profile';
import { ANIMAL_REPOSITORY } from './domain/ports/output/animal-repository';
import { ADOPTION_REPOSITORY } from './domain/ports/output/adoption-repository';
import { AUTH_REPOSITORY } from './domain/ports/output/auth-repository';
import { LANDING_REPOSITORY } from './domain/ports/output/landing-repository';
import { MEDIA_REPOSITORY } from './domain/ports/output/media-repository';
import { PUBLICATION_REPOSITORY } from './domain/ports/output/publication-repository';
import { SETTINGS_REPOSITORY } from './domain/ports/output/settings-repository';
import { USER_REPOSITORY } from './domain/ports/output/user-repository';
import { VOLUNTEER_REPOSITORY } from './domain/ports/output/volunteer-repository';
import { AdminLandingController } from './infrastructure/controllers/admin/landing';
import { AdminAdoptionsController } from './infrastructure/controllers/admin/adoptions';
import { AdminAnimalsController } from './infrastructure/controllers/admin/animals';
import { AdminMediaController } from './infrastructure/controllers/admin/media';
import { AdminPublicationsController } from './infrastructure/controllers/admin/publications';
import { AdminSettingsController } from './infrastructure/controllers/admin/settings';
import { AdminUsersController } from './infrastructure/controllers/admin/users';
import { AdminVolunteersController } from './infrastructure/controllers/admin/volunteers';
import { AuthController } from './infrastructure/controllers/auth';
import { AdoptionsController } from './infrastructure/controllers/adoptions';
import { PublicLandingController } from './infrastructure/controllers/public/landing';
import { PublicAdoptionsController } from './infrastructure/controllers/public/adoptions';
import { PublicAnimalsController } from './infrastructure/controllers/public/animals';
import { PublicPublicationsController } from './infrastructure/controllers/public/publications';
import { PublicSettingsController } from './infrastructure/controllers/public/settings';
import { PublicVolunteersController } from './infrastructure/controllers/public/volunteers';
import { UsersController } from './infrastructure/controllers/users';
import { VolunteersController } from './infrastructure/controllers/volunteers';
import { RolesPermissionsGuard } from './infrastructure/http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from './infrastructure/http/auth/guards/supabase-auth';
import { AuthSupabaseRepository } from './infrastructure/persistence/supabase/repositories/auth-supabase';
import { AdoptionSupabaseRepository } from './infrastructure/persistence/supabase/repositories/adoption-supabase';
import { AnimalSupabaseRepository } from './infrastructure/persistence/supabase/repositories/animal-supabase';
import { LandingSupabaseRepository } from './infrastructure/persistence/supabase/repositories/landing-supabase';
import { MediaSupabaseRepository } from './infrastructure/persistence/supabase/repositories/media-supabase';
import { PublicationSupabaseRepository } from './infrastructure/persistence/supabase/repositories/publication-supabase';
import { SettingsSupabaseRepository } from './infrastructure/persistence/supabase/repositories/settings-supabase';
import { SupabaseModule } from './infrastructure/persistence/supabase/supabase.module';
import { UserSupabaseRepository } from './infrastructure/persistence/supabase/repositories/user-supabase';
import { VolunteerSupabaseRepository } from './infrastructure/persistence/supabase/repositories/volunteer-supabase';

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
    PublicAnimalsController,
    AdminAnimalsController,
    PublicAdoptionsController,
    AdoptionsController,
    AdminAdoptionsController,
    PublicVolunteersController,
    VolunteersController,
    AdminVolunteersController,
    PublicPublicationsController,
    AdminPublicationsController,
    AdminMediaController,
    PublicSettingsController,
    AdminSettingsController,
  ],
  providers: [
    CreateOperatorUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
    GetMyProfileUseCase,
    UpdateMyProfileUseCase,
    GetPublicAnimalsUseCase,
    GetPublicAnimalBySlugUseCase,
    GetAdminAnimalsUseCase,
    CreateAnimalUseCase,
    UpdateAnimalUseCase,
    DeleteAnimalUseCase,
    AddAnimalImageUseCase,
    DeleteAnimalImageUseCase,
    AddAnimalCharacteristicUseCase,
    UpdateAnimalCharacteristicUseCase,
    DeleteAnimalCharacteristicUseCase,
    GetPublicHousingTypesUseCase,
    GetAdminHousingTypesUseCase,
    CreateHousingTypeUseCase,
    UpdateHousingTypeUseCase,
    DeleteHousingTypeUseCase,
    CreateAdoptionApplicationUseCase,
    GetMyAdoptionApplicationsUseCase,
    GetAdminAdoptionApplicationsUseCase,
    UpdateAdoptionStatusUseCase,
    GetPublicVolunteerRequirementsUseCase,
    GetAdminVolunteerRequirementsUseCase,
    CreateVolunteerRequirementUseCase,
    UpdateVolunteerRequirementUseCase,
    DeleteVolunteerRequirementUseCase,
    CreateVolunteerApplicationUseCase,
    GetMyVolunteerApplicationsUseCase,
    GetAdminVolunteerApplicationsUseCase,
    UpdateVolunteerStatusUseCase,
    GetVolunteerProfilesUseCase,
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
    GetPublicContactInfoUseCase,
    GetAdminContactInfoUseCase,
    CreateContactInfoUseCase,
    UpdateContactInfoUseCase,
    DeleteContactInfoUseCase,
    GetPublicSocialLinksUseCase,
    GetAdminSocialLinksUseCase,
    CreateSocialLinkUseCase,
    UpdateSocialLinkUseCase,
    DeleteSocialLinkUseCase,
    GetPublicFaqItemsUseCase,
    GetAdminFaqItemsUseCase,
    CreateFaqItemUseCase,
    UpdateFaqItemUseCase,
    DeleteFaqItemUseCase,
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
    {
      provide: ANIMAL_REPOSITORY,
      useClass: AnimalSupabaseRepository,
    },
    {
      provide: ADOPTION_REPOSITORY,
      useClass: AdoptionSupabaseRepository,
    },
    {
      provide: VOLUNTEER_REPOSITORY,
      useClass: VolunteerSupabaseRepository,
    },
    {
      provide: SETTINGS_REPOSITORY,
      useClass: SettingsSupabaseRepository,
    },
  ],
})
export class AppModule {}
