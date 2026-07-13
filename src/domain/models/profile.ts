export interface Profile {
  id: string;
  avatarId: string | null;
  firstNames: string | null;
  lastNames: string | null;
  phone: string | null;
  birthDate: string | null;
  address: string | null;
  housingSector: string | null;
  status: 'active' | 'inactive' | 'blocked';
  userType: 'public' | 'staff';
  createdAt: string;
  updatedAt: string;
}
