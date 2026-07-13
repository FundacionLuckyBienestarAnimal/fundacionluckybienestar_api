import type {
  AdoptionApplication,
  AdoptionStatus,
  HousingType,
} from '../../models/adoptions/adoption';

export const ADOPTION_REPOSITORY = Symbol('ADOPTION_REPOSITORY');

export interface CreateHousingTypeInput {
  key: string;
  name: string;
  description?: string;
  requiresOtherDetail?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateHousingTypeInput {
  key?: string;
  name?: string;
  description?: string;
  requiresOtherDetail?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateAdoptionApplicationInput {
  userId: string;
  animalId: string;
  housingTypeId: string;
  housingOtherDetail?: string;
  adoptionReason: string;
}

export interface UpdateAdoptionStatusInput {
  status: AdoptionStatus;
  reviewMessage?: string;
  changedBy: string;
}

export interface AdoptionRepositoryPort {
  findPublicHousingTypes(): Promise<HousingType[]>;
  findAdminHousingTypes(): Promise<HousingType[]>;
  createHousingType(input: CreateHousingTypeInput): Promise<HousingType>;
  updateHousingType(
    id: string,
    input: UpdateHousingTypeInput,
  ): Promise<HousingType>;
  deleteHousingType(id: string): Promise<void>;
  createApplication(
    input: CreateAdoptionApplicationInput,
  ): Promise<AdoptionApplication>;
  findMyApplications(userId: string): Promise<AdoptionApplication[]>;
  findAdminApplications(): Promise<AdoptionApplication[]>;
  updateApplicationStatus(
    id: string,
    input: UpdateAdoptionStatusInput,
  ): Promise<AdoptionApplication>;
}
