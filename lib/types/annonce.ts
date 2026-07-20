export interface AnnonceAuthor {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Annonce {
  id: string;
  title: string;
  content: string;
  promotionId: string;
  promotion?: { id: string; name: string } | null;
  createdById: string;
  createdBy?: AnnonceAuthor | null;
  createdAt: string;
}
