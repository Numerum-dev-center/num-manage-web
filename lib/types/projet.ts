import type { FormateurSummary } from "./promotion";

export type StatutProjet = "non_commence" | "en_cours" | "soumis" | "evalue";

export type PosteProjet = "frontend" | "backend" | "fullstack" | "lead" | "devops" | "designer";

export const POSTE_PROJET_OPTIONS: PosteProjet[] = [
  "frontend",
  "backend",
  "fullstack",
  "lead",
  "devops",
  "designer",
];

export const POSTE_PROJET_LABELS: Record<PosteProjet, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Fullstack Developer",
  lead: "Lead",
  devops: "DevOps",
  designer: "Designer",
};

export interface PromotionOption {
  id: string;
  name: string;
}

export interface ApprenantSoumissionSummary {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  specialite?: string | null;
}

export interface Soumission {
  id: string;
  projetId: string;
  apprenantId: string;
  apprenant?: ApprenantSoumissionSummary;
  lienGithub: string;
  lienDemo: string;
  commentaire?: string | null;
  note?: number | null;
  feedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Projet {
  id: string;
  titre: string;
  description: string;
  technologies: string;
  dateLimite: string;
  isArchived: boolean;
  promotionId: string;
  promotion?: { id: string; name: string };
  createdById: string;
  createdBy?: FormateurSummary;
  createdAt: string;
  updatedAt: string;
}

/** Vue formateur/admin (GET /admin/projets) : statut agrégé sur toute la promotion. */
export interface ProjetAvecStats extends Projet {
  statut: StatutProjet;
  enRetard: boolean;
  totalApprenants: number;
  totalSoumissions: number;
  totalEvaluees: number;
}

/** Vue apprenant (GET /projets) : statut de sa propre soumission. */
export interface ProjetPourApprenant extends Projet {
  statut: StatutProjet;
  enRetard: boolean;
  maSoumission: Soumission | null;
  maPoste: PosteProjet | null;
}

/** Vue formateur/admin (GET /admin/projets/:id/postes) : roster de la promotion avec poste éventuel. */
export interface ApprenantAvecPoste {
  apprenant: ApprenantSoumissionSummary;
  poste: PosteProjet | null;
}
