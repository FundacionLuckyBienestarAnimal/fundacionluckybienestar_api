import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMediaDto } from '../../../application/dto/media/update-media';
import { UploadMediaDto } from '../../../application/dto/media/upload-media';
import { DeleteMediaUseCase } from '../../../application/use-cases/media/delete-media';
import { GetMediaUseCase } from '../../../application/use-cases/media/get-media';
import { UpdateMediaUseCase } from '../../../application/use-cases/media/update-media';
import { UploadMediaUseCase } from '../../../application/use-cases/media/upload-media';
import type { AuthenticatedUser } from '../../../domain/models/auth/authenticated-user';
import type { MediaAsset } from '../../../domain/models/media/media-asset';
import { CurrentUser } from '../../http/auth/decorators/current-user';
import { Permissions } from '../../http/auth/decorators/permissions';
import { RolesPermissionsGuard } from '../../http/auth/guards/roles-permissions';
import { SupabaseAuthGuard } from '../../http/auth/guards/supabase-auth';

type UploadedMediaFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Controller('admin/media')
@UseGuards(SupabaseAuthGuard, RolesPermissionsGuard)
@Permissions('content.manage')
export class AdminMediaController {
  constructor(
    private readonly getMediaUseCase: GetMediaUseCase,
    private readonly uploadMediaUseCase: UploadMediaUseCase,
    private readonly updateMediaUseCase: UpdateMediaUseCase,
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
  ) {}

  @Get()
  getMedia(): Promise<MediaAsset[]> {
    return this.getMediaUseCase.execute();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMedia(
    @UploadedFile() file: UploadedMediaFile | undefined,
    @Body() body: UploadMediaDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaAsset> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.uploadMediaUseCase.execute({
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
      altText: body.altText,
      mediaType: body.mediaType,
      folder: body.folder,
      uploadedBy: user.id,
    });
  }

  @Patch(':id')
  updateMedia(
    @Param('id') id: string,
    @Body() body: UpdateMediaDto,
  ): Promise<MediaAsset> {
    return this.updateMediaUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteMedia(@Param('id') id: string): Promise<void> {
    return this.deleteMediaUseCase.execute(id);
  }
}
