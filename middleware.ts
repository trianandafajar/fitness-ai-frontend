import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const ADMIN_LOGIN = "/admin/login";
const ONBOARDING_ROUTE = "/onboarding";
const AFTER_LOGIN_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const profileCompleted = request.cookies.get("profile_completed")?.value === "true";
  const isAdmin = request.cookies.get("is_admin")?.value === "true";

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN;
  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname === ADMIN_LOGIN;

  // Admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Admin login page - redirect to admin dashboard if already logged in as admin
  if (pathname === ADMIN_LOGIN) {
    if (token && isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Regular user routes
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
