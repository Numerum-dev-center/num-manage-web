export type UserRole = "admin" | "manager" | "student";

export interface UserPromotionSummary {
  id: string;
  name: string;
  isArchived: boolean;
}

export interface ApprenantSummary {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  promotionId?: string | null;
  promotion?: UserPromotionSummary | null;
  createdAt: string;
}
