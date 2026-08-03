export type NotificationType =
  | "nouvelle_annonce"
  | "projet_note"
  | "affectation_promotion"
  | "affectation_projet";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}
