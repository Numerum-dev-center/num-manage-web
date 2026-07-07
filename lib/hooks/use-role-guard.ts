import { NextRequest, NextResponse } from "next/server";

// Adapte ce nom si ton cookie httpOnly a un nom différent
const AUTH_COOKIE_NAME = "refreshToken";

// Routes accessibles SANS être connecté (tout le reste est protégé)
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/", // page d'accueil publique, si tu en as une
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Applique le middleware à toutes les routes SAUF assets statiques et fichiers Next.js internes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};