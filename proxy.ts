import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/verify-email", "/forgot-password", "/reset-password", "/terms", "/privacy"];
const ADMIN_LOGIN = "/admin/login";
const ONBOARDING_ROUTE = "/onboarding";
const AFTER_LOGIN_ROUTE = "/dashboard";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fitnessai.app";

async function fetchUser(token: string): Promise<{ is_admin?: boolean } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { user?: { is_admin?: boolean } };
    return json?.user ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const profileCompleted = request.cookies.get("profile_completed")?.value === "true";

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN;
  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname === ADMIN_LOGIN;

  // Admin routes: admin status is verified against the backend token,
  // never from a client-side cookie that could be forged from devtools.
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
    const user = await fetchUser(token);
    if (!user) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    }
    if (!user.is_admin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Admin login page - redirect to admin dashboard only for verified admins
  if (pathname === ADMIN_LOGIN) {
    if (!token) return NextResponse.next();
    const user = await fetchUser(token);
    if (user?.is_admin) {
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
    const user = await fetchUser(token);
    if (user?.is_admin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
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
