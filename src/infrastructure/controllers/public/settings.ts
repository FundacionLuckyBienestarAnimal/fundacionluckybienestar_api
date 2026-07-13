import { Controller, Get } from '@nestjs/common';
import { GetPublicContactInfoUseCase } from '../../../application/use-cases/settings/get-public-contact-info';
import { GetPublicFaqItemsUseCase } from '../../../application/use-cases/settings/get-public-faq-items';
import { GetPublicSocialLinksUseCase } from '../../../application/use-cases/settings/get-public-social-links';
import type {
  ContactInfo,
  FaqItem,
  SocialLink,
} from '../../../domain/models/settings/public-settings';

@Controller('public')
export class PublicSettingsController {
  constructor(
    private readonly getPublicContactInfoUseCase: GetPublicContactInfoUseCase,
    private readonly getPublicSocialLinksUseCase: GetPublicSocialLinksUseCase,
    private readonly getPublicFaqItemsUseCase: GetPublicFaqItemsUseCase,
  ) {}

  @Get('contact-info')
  getContactInfo(): Promise<ContactInfo[]> {
    return this.getPublicContactInfoUseCase.execute();
  }

  @Get('social-links')
  getSocialLinks(): Promise<SocialLink[]> {
    return this.getPublicSocialLinksUseCase.execute();
  }

  @Get('faqs')
  getFaqs(): Promise<FaqItem[]> {
    return this.getPublicFaqItemsUseCase.execute();
  }
}
