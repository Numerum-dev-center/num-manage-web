import { NextRequest, NextResponse } from "next/server";

// Liste des routes accessibles SANS être connecté
// Tout ce qui n'est PAS dans cette liste reste accessible.
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/google", // point d'entrée + callback OAuth Google
  "/", // page d'accueil, si elle doit être publique
];

// Vérifie si le chemin demandé fait partie des routes publiques
function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

// Ce middleware s'exécute AVANT le rendu de la page,
// directement sur le serveur, pour chaque requête entrante
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la route est publique, on laisse passer sans vérification
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Dans un déploiement cross-domain (Vercel frontend + Render backend),
  // le cookie `refreshToken` est stocké par l'API sur son propre domaine.
  // Le middleware Next.js côté frontend ne peut pas lire ce cookie.
  // La protection doit donc rester côté client dans `AuthGuard`.
  return NextResponse.next();
}

// Configuration : sur quelles routes ce middleware doit s'exécuter
export const config = {
  // Applique le middleware à TOUT sauf les fichiers statiques Next.js internes
  // et les assets publics (images, favicon, etc.) servis depuis /public
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};