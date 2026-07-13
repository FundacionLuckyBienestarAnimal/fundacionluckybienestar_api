import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import type { MediaAsset } from '../../../../domain/models/media/media-asset';
import type {
  MediaRepositoryPort,
  UpdateMediaInput,
  UploadMediaInput,
} from '../../../../domain/ports/output/media-repository';
import { SUPABASE_ADMIN_CLIENT } from '../supabase.tokens';
import type { MediaAssetRow } from '../types/bdd-supabase';

@Injectable()
export class MediaSupabaseRepository implements MediaRepositoryPort {
  private readonly bucket: string;

  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
    config: ConfigService,
  ) {
    const bucket = config.get<string>('SUPABASE_STORAGE_BUCKET');

    if (!bucket) {
      throw new Error(
        'Missing required environment variable: SUPABASE_STORAGE_BUCKET',
      );
    }

    this.bucket = bucket;
  }

  async findAll(): Promise<MediaAsset[]> {
    const { data, error } = await this.supabase
      .from('media_assets')
      .select(this.mediaSelect)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .returns<MediaAssetRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data ?? []).map((row) => this.toMediaAsset(row));
  }

  async upload(input: UploadMediaInput): Promise<MediaAsset> {
    this.validateMimeType(input.mimeType);

    const path = this.buildPath(input.folder, input.fileName);
    const { error: uploadError } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, input.buffer, {
        contentType: input.mimeType,
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestException(uploadError.message);
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);

    const { data, error } = await this.supabase
      .from('media_assets')
      .insert({
        bucket: this.bucket,
        path,
        public_url: publicUrlData.publicUrl,
        alt_text: input.altText,
        media_type: input.mediaType ?? 'image',
        uploaded_by: input.uploadedBy,
      })
      .select(this.mediaSelect)
      .single<MediaAssetRow>();

    if (error) {
      await this.supabase.storage.from(this.bucket).remove([path]);
      throw new InternalServerErrorException(error.message);
    }

    return this.toMediaAsset(data);
  }

  async update(id: string, input: UpdateMediaInput): Promise<MediaAsset> {
    const { data, error } = await this.supabase
      .from('media_assets')
      .update({
        alt_text: input.altText,
        media_type: input.mediaType,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(this.mediaSelect)
      .single<MediaAssetRow>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return this.toMediaAsset(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('media_assets')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private validateMimeType(mimeType: string): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowed.includes(mimeType)) {
      throw new BadRequestException(
        'Only jpeg, png, webp and gif images are allowed',
      );
    }
  }

  private buildPath(folder: string | undefined, fileName: string): string {
    const safeFolder = (folder ?? 'general')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9/_-]/g, '-')
      .replace(/\/+/g, '/')
      .replace(/^\/|\/$/g, '');
    const safeFileName = fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-');

    return `${safeFolder}/${Date.now()}-${safeFileName}`;
  }

  private toMediaAsset(row: MediaAssetRow): MediaAsset {
    return {
      id: row.id,
      bucket: row.bucket,
      path: row.path,
      publicUrl: row.public_url,
      altText: row.alt_text,
      mediaType: row.media_type,
      uploadedBy: row.uploaded_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }

  private readonly mediaSelect =
    'id, bucket, path, public_url, alt_text, media_type, uploaded_by, created_at, updated_at, deleted_at';
}
