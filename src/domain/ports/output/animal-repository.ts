import type {
  Animal,
  AnimalCharacteristic,
  AnimalImage,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../models/animals/animal';

export const ANIMAL_REPOSITORY = Symbol('ANIMAL_REPOSITORY');

export interface CreateAnimalInput {
  createdBy: string;
  name: string;
  slug: string;
  species: AnimalSpecies;
  sex?: AnimalSex;
  size?: AnimalSize;
  ageLabel?: string;
  status?: AnimalStatus;
  isSterilized?: boolean;
  description?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateAnimalInput {
  name?: string;
  slug?: string;
  species?: AnimalSpecies;
  sex?: AnimalSex;
  size?: AnimalSize;
  ageLabel?: string;
  status?: AnimalStatus;
  isSterilized?: boolean;
  description?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface AddAnimalImageInput {
  mediaId: string;
  isPrimary?: boolean;
  orderIndex?: number;
}

export interface AddAnimalCharacteristicInput {
  label: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface UpdateAnimalCharacteristicInput {
  label?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface AnimalRepositoryPort {
  findPublicAnimals(): Promise<Animal[]>;
  findPublicAnimalBySlug(slug: string): Promise<Animal>;
  findAdminAnimals(): Promise<Animal[]>;
  createAnimal(input: CreateAnimalInput): Promise<Animal>;
  updateAnimal(id: string, input: UpdateAnimalInput): Promise<Animal>;
  deleteAnimal(id: string): Promise<void>;
  addImage(animalId: string, input: AddAnimalImageInput): Promise<AnimalImage>;
  deleteImage(animalId: string, imageId: string): Promise<void>;
  addCharacteristic(
    animalId: string,
    input: AddAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic>;
  updateCharacteristic(
    animalId: string,
    characteristicId: string,
    input: UpdateAnimalCharacteristicInput,
  ): Promise<AnimalCharacteristic>;
  deleteCharacteristic(
    animalId: string,
    characteristicId: string,
  ): Promise<void>;
}
