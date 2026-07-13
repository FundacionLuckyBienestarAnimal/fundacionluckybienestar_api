import type { MediaAsset } from '../media/media-asset';

export type AnimalSpecies = 'dog' | 'cat' | 'other';
export type AnimalSex = 'male' | 'female' | 'unknown';
export type AnimalSize = 'small' | 'medium' | 'large';
export type AnimalStatus =
  'available' | 'in_process' | 'sponsored' | 'adopted' | 'hidden';

export interface AnimalImage {
  id: string;
  animalId: string;
  mediaId: string;
  isPrimary: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  media?: MediaAsset | null;
}

export interface AnimalCharacteristic {
  id: string;
  animalId: string;
  label: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Animal {
  id: string;
  createdBy: string | null;
  name: string;
  slug: string;
  species: AnimalSpecies;
  sex: AnimalSex;
  size: AnimalSize;
  ageLabel: string | null;
  status: AnimalStatus;
  isSterilized: boolean;
  description: string | null;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images?: AnimalImage[];
  characteristics?: AnimalCharacteristic[];
}
