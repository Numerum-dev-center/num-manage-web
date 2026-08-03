const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** L'API renvoie un chemin relatif (ex: "/avatars/xyz.png") ; on le préfixe pour <img src>. */
export function getAvatarUrl(avatarUrl?: string | null): string | null {
  if (!avatarUrl) return null;
  return `${API_URL}${avatarUrl}`;
}
