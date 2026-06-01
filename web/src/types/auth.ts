export type SystemAccessLevel = "MEMBER" | "VIEWER" | "EDITOR";
export type SystemAccessScope = "GLOBAL" | "CHURCH";

export interface SystemPermissions {
  canViewManagementData: boolean;
  canEditManagementData: boolean;
}

export interface SystemAccess {
  level: SystemAccessLevel;
  scope: SystemAccessScope;
  memberId: number;
  churchId: number;
  permissions: SystemPermissions;
}

export interface AuthenticatedUser {
  id: number;
  login: string;
}

export interface AuthenticatedMember {
  id: number;
  name: string;
  email: string;
  ecclesiasticalRole: string;
  birth_date?: string;
  batism_date?: string;
  cpf?: string;
  rg?: number;
  foto?: string | null;
  id_church: number;
  church?: Church;
}

export interface SessionResponse {
  token: string;
  mustChangePassword: boolean;
  user: AuthenticatedUser;
  member: AuthenticatedMember;
  access?: SystemAccess;
  permissions?: SystemPermissions;
}

export interface MeResponse {
  mustChangePassword: boolean;
  user: AuthenticatedUser;
  member: AuthenticatedMember;
  access?: SystemAccess;
  permissions?: SystemPermissions;
}

export interface ChurchLocation {
  id: number;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  cep: number;
}

export interface Church {
  id: number;
  creationDate: string;
  type: "HEADQUARTER" | "BRANCH";
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  parentChurchId?: number | null;
  deactivatedAt?: string | null;
  deletedAt?: string | null;
  id_location: number;
  location?: ChurchLocation;
}

export interface MemberRecord {
  id: number;
  name: string;
  birth_date: string;
  batism_date: string;
  ecclesiasticalRole: string;
  cpf: string;
  rg: number;
  email: string;
  foto?: string | null;
  id_church: number;
  id_user?: number;
}

export interface ManagerRecord {
  id: number;
  id_member: number;
  id_church: number;
  startDate: string;
  endDate?: string | null;
}

export interface TreasurerRecord {
  id: number;
  id_member: number;
  startDate: string;
  endDate?: string | null;
  member?: MemberRecord;
}

export interface CostRecord {
  id: number;
  value: number;
  date: string;
  description: string;
  id_church: number;
  deletedAt?: string | null;
}

export interface OfferRecord {
  id: number;
  value: number;
  id_treasurer: number;
  deletedAt?: string | null;
  treasurer?: TreasurerRecord;
}

export interface CultOfferRecord {
  id: number;
  id_cult: number;
  id_offer: number;
  offer?: OfferRecord;
}

export interface SpecialOfferRecord {
  id: number;
  reason: string;
  date: string;
  id_offer: number;
  id_member: number;
  id_church: number;
  deletedAt?: string | null;
  offer?: OfferRecord;
  member?: MemberRecord;
  church?: Church;
}

export interface TitheRecord {
  id: number;
  month: number;
  year: number;
  id_special_offer: number;
  deletedAt?: string | null;
  specialOffer?: SpecialOfferRecord;
}

export interface CultRecord {
  id: number;
  date: string;
  theme: string;
  id_church: number;
  id_offer?: number | null;
  deletedAt?: string | null;
  church?: Church;
  offer?: OfferRecord;
  recurrenceGroup?: string | null;
  recurrencePattern?: string | null;
  recurrenceUntil?: string | null;
  CultOffer?: CultOfferRecord[];
}
