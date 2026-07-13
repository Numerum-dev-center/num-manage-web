export type UserRole = "admin" | "manager" | "student";

export interface ApprenantSummary {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  promotionId?: string | null;
}
