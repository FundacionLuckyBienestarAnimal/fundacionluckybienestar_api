export type VolunteerRequirementType =
  'material' | 'schedule' | 'condition' | 'other';
export type VolunteerAvailabilityType = 'weekdays' | 'weekends' | 'both';
export type VolunteerApplicationStatus =
  'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
export type VolunteerProfileStatus = 'active' | 'inactive' | 'suspended';

export interface VolunteerRequirement {
  id: string;
  title: string;
  description: string | null;
  type: VolunteerRequirementType;
  isRequired: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VolunteerApplication {
  id: string;
  userId: string;
  motivation: string;
  availabilityType: VolunteerAvailabilityType;
  status: VolunteerApplicationStatus;
  isAdultConfirmed: boolean;
  reviewedBy: string | null;
  reviewMessage: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  approvedApplicationId: string;
  status: VolunteerProfileStatus;
  approvedAt: string;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
