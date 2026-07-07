import { NextRequest, NextResponse } from "next/server";

// Nom du cookie httpOnly posé par le backend NestJS lors du login/refresh
// (vérifié dans ton auth.controller.ts : res.cookie('refreshToken', ...))
const AUTH_COOKIE_NAME = "refreshToken";

// Liste des routes accessibles SANS être connecté
// Tout ce qui n'est PAS dans cette liste sera automatiquement protégé
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
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

  // Sinon, on cherche le cookie d'authentification dans la requête
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Pas de cookie = utilisateur non connecté → redirection vers login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    // On garde en mémoire la page qu'il voulait visiter,
    // pour l'y renvoyer après connexion (optionnel mais pratique)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie présent → on laisse passer la requête normalement
  return NextResponse.next();
}

// Configuration : sur quelles routes ce middleware doit s'exécuter
export const config = {
  // Applique le middleware à TOUT sauf les fichiers statiques Next.js internes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};