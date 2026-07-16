import type { ApprenantSummary } from "./user";

export interface FormateurSummary {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  isArchived: boolean;
  startDate?: string | null;
  endDate?: string | null;
  formateur?: FormateurSummary | null;
  formateurId?: string | null;
  apprenants?: ApprenantSummary[];
  createdAt: string;
  updatedAt: string;
}
