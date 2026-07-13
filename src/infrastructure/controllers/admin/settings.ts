import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateContactInfoDto } from '../../../application/dto/settings/create-contact-info';
import { CreateFaqItemDto } from '../../../application/dto/settings/create-faq-item';
import { CreateSocialLinkDto } from '../../../application/dto/settings/create-social-link';
import { UpdateContactInfoDto } from '../../../application/dto/settings/update-contact-info';
import { UpdateFaqItemDto } from '../../../application/dto/settings/update-faq-item';
import { UpdateSocialLinkDto } from '../../../application/dto/settings/update-social-link';
import { CreateContactInfoUseCase } from '../../../application/use-cases/settings/create-contact-info';
import { CreateFaqItemUseCase } from '../../../application/use-cases/settings/create-faq-item';
import { CreateSocialLinkUseCase } from '../../../application/use-cases/settings/create-social-link';
import { DeleteContactInfoUseCase } from '../../../application/use-cases/settings/delete-contact-info';
import { DeleteFaqItemUseCase } from '../../../application/use-cases/settings/delete-faq-item';
import { DeleteSocialLinkUseCase } from '../../../application/use-cases/settings/delete-social-link';
import { GetAdminContactInfoUseCase } from '../../../application/use-cases/settings/get-admin-contact-info';
import { GetAdminFaqItemsUseCase } from '../../../application/use-cases/settings/get-admin-faq-items';
import { GetAdminSocialLinksUseCase } from '../../../application/use-cases/settings/get-admin-social-links';
import { UpdateContactInfoUseCase } from '../../../application/use-cases/settings/update-contact-info';
import { UpdateFaqItemUseCase } from '../../../application/use-cases/settings/update-faq-item';
import { UpdateSocialLinkUseCase } from '../../../application/use-cases/settings/update-social-link';
import type {
  ContactInfo,
  FaqItem,
  SocialLink,
} from '../../../domain/models/settings/public-settings';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

@Controller('admin/settings')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('settings.manage')
export class AdminSettingsController {
  constructor(
    private readonly getAdminContactInfoUseCase: GetAdminContactInfoUseCase,
    private readonly createContactInfoUseCase: CreateContactInfoUseCase,
    private readonly updateContactInfoUseCase: UpdateContactInfoUseCase,
    private readonly deleteContactInfoUseCase: DeleteContactInfoUseCase,
    private readonly getAdminSocialLinksUseCase: GetAdminSocialLinksUseCase,
    private readonly createSocialLinkUseCase: CreateSocialLinkUseCase,
    private readonly updateSocialLinkUseCase: UpdateSocialLinkUseCase,
    private readonly deleteSocialLinkUseCase: DeleteSocialLinkUseCase,
    private readonly getAdminFaqItemsUseCase: GetAdminFaqItemsUseCase,
    private readonly createFaqItemUseCase: CreateFaqItemUseCase,
    private readonly updateFaqItemUseCase: UpdateFaqItemUseCase,
    private readonly deleteFaqItemUseCase: DeleteFaqItemUseCase,
  ) {}

  @Get('contact-info')
  getContactInfo(): Promise<ContactInfo[]> {
    return this.getAdminContactInfoUseCase.execute();
  }

  @Post('contact-info')
  createContactInfo(@Body() body: CreateContactInfoDto): Promise<ContactInfo> {
    return this.createContactInfoUseCase.execute(body);
  }

  @Patch('contact-info/:id')
  updateContactInfo(
    @Param('id') id: string,
    @Body() body: UpdateContactInfoDto,
  ): Promise<ContactInfo> {
    return this.updateContactInfoUseCase.execute(id, body);
  }

  @Delete('contact-info/:id')
  @HttpCode(204)
  deleteContactInfo(@Param('id') id: string): Promise<void> {
    return this.deleteContactInfoUseCase.execute(id);
  }

  @Get('social-links')
  getSocialLinks(): Promise<SocialLink[]> {
    return this.getAdminSocialLinksUseCase.execute();
  }

  @Post('social-links')
  createSocialLink(@Body() body: CreateSocialLinkDto): Promise<SocialLink> {
    return this.createSocialLinkUseCase.execute(body);
  }

  @Patch('social-links/:id')
  updateSocialLink(
    @Param('id') id: string,
    @Body() body: UpdateSocialLinkDto,
  ): Promise<SocialLink> {
    return this.updateSocialLinkUseCase.execute(id, body);
  }

  @Delete('social-links/:id')
  @HttpCode(204)
  deleteSocialLink(@Param('id') id: string): Promise<void> {
    return this.deleteSocialLinkUseCase.execute(id);
  }

  @Get('faqs')
  getFaqs(): Promise<FaqItem[]> {
    return this.getAdminFaqItemsUseCase.execute();
  }

  @Post('faqs')
  createFaq(@Body() body: CreateFaqItemDto): Promise<FaqItem> {
    return this.createFaqItemUseCase.execute(body);
  }

  @Patch('faqs/:id')
  updateFaq(
    @Param('id') id: string,
    @Body() body: UpdateFaqItemDto,
  ): Promise<FaqItem> {
    return this.updateFaqItemUseCase.execute(id, body);
  }

  @Delete('faqs/:id')
  @HttpCode(204)
  deleteFaq(@Param('id') id: string): Promise<void> {
    return this.deleteFaqItemUseCase.execute(id);
  }
}
