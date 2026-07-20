export interface RessourceUploader {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Ressource {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  promotionId: string;
  promotion?: { id: string; name: string } | null;
  uploadedById: string;
  uploadedBy?: RessourceUploader | null;
  createdAt: string;
}
