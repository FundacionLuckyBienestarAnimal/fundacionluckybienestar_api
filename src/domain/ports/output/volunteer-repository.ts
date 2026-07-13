import type {
  VolunteerApplication,
  VolunteerApplicationStatus,
  VolunteerAvailabilityType,
  VolunteerProfile,
  VolunteerRequirement,
  VolunteerRequirementType,
} from '../../models/volunteers/volunteer';

export const VOLUNTEER_REPOSITORY = Symbol('VOLUNTEER_REPOSITORY');

export interface CreateVolunteerRequirementInput {
  title: string;
  description?: string;
  type?: VolunteerRequirementType;
  isRequired?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateVolunteerRequirementInput {
  title?: string;
  description?: string;
  type?: VolunteerRequirementType;
  isRequired?: boolean;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CreateVolunteerApplicationInput {
  userId: string;
  motivation: string;
  availabilityType: VolunteerAvailabilityType;
  isAdultConfirmed?: boolean;
}

export interface UpdateVolunteerApplicationStatusInput {
  status: VolunteerApplicationStatus;
  reviewMessage?: string;
  changedBy: string;
}

export interface VolunteerRepositoryPort {
  findPublicRequirements(): Promise<VolunteerRequirement[]>;
  findAdminRequirements(): Promise<VolunteerRequirement[]>;
  createRequirement(
    input: CreateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement>;
  updateRequirement(
    id: string,
    input: UpdateVolunteerRequirementInput,
  ): Promise<VolunteerRequirement>;
  deleteRequirement(id: string): Promise<void>;
  createApplication(
    input: CreateVolunteerApplicationInput,
  ): Promise<VolunteerApplication>;
  findMyApplications(userId: string): Promise<VolunteerApplication[]>;
  findAdminApplications(): Promise<VolunteerApplication[]>;
  updateApplicationStatus(
    id: string,
    input: UpdateVolunteerApplicationStatusInput,
  ): Promise<VolunteerApplication>;
  findProfiles(): Promise<VolunteerProfile[]>;
}
