export type RessourceType = "pdf" | "zip" | "lien";

export interface RessourceUploader {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Ressource {
  id: string;
  type: RessourceType;
  title: string;
  filename: string | null;
  mimeType: string | null;
  size: number | null;
  url: string | null;
  promotionId: string;
  promotion?: { id: string; name: string } | null;
  uploadedById: string;
  uploadedBy?: RessourceUploader | null;
  createdAt: string;
}
