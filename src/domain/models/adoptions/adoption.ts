export type AdoptionStatus =
  | 'submitted'
  | 'under_review'
  | 'in_process'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface HousingType {
  id: string;
  key: string;
  name: string;
  description: string | null;
  requiresOtherDetail: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AdoptionApplication {
  id: string;
  userId: string;
  animalId: string;
  housingTypeId: string;
  housingOtherDetail: string | null;
  adoptionReason: string;
  status: AdoptionStatus;
  reviewedBy: string | null;
  reviewMessage: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  processStartedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  housingType?: HousingType | null;
}

export interface AdoptionStatusHistory {
  id: string;
  applicationId: string;
  previousStatus: AdoptionStatus | null;
  newStatus: AdoptionStatus;
  message: string | null;
  changedBy: string | null;
  createdAt: string;
}
