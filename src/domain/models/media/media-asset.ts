export type MediaType = 'image' | 'video' | 'document' | 'other';

export interface MediaAsset {
  id: string;
  bucket: string;
  path: string;
  publicUrl: string | null;
  altText: string | null;
  mediaType: MediaType;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
