import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions, verifySession } from "@/lib/auth/session";

/**
 * Gatekeeper for the admin area. Verifies the JWT signature/expiry only —
 * Route Handlers and the panel layout re-check the admin in the database and
 * enforce role permissions.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  if (pathname !== "/admin") {
    loginUrl.searchParams.set("next", `${pathname}${search}`);
  }
  const response = NextResponse.redirect(loginUrl);
  // Drop an invalid/expired cookie so the browser stops sending it.
  // (set with the same path/flags as login — `cookies.delete` would not match path "/").
  if (request.cookies.has(SESSION_COOKIE)) {
    response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  }
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
