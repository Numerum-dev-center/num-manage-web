import type { ApprenantSummary } from "./user";

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  isArchived: boolean;
  apprenants?: ApprenantSummary[];
  createdAt: string;
  updatedAt: string;
}
