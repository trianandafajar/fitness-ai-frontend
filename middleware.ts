import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const ONBOARDING_ROUTE = "/onboarding";
const AFTER_LOGIN_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const profileCompleted = request.cookies.get("profile_completed")?.value === "true";

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublic) {
    const destination = profileCompleted ? AFTER_LOGIN_ROUTE : ONBOARDING_ROUTE;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname === ONBOARDING_ROUTE && profileCompleted) {
    return NextResponse.redirect(new URL(AFTER_LOGIN_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
