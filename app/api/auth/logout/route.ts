import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  }
  const response = NextResponse.json({ message: "Signed out." });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
