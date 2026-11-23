import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { BodyTooLargeError, readJsonBody } from "@/lib/http";
import { consumeRateLimit, getClientIp, resetRateLimit } from "@/lib/auth/rate-limit";
import { isSameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations";
import { AdminModel } from "@/models";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS = "Invalid email or password.";

// Compared against when the email is unknown so response time does not reveal
// whether an account exists. Precomputed (cost 12, same as real hashes) from a
// random, discarded value — it matches no password.
const DUMMY_HASH = "$2b$12$Tc9Gkbdj3UH7e3c7Fkfsou8K5vDjvfA7cOW/lC75hwLzQE3Q9KQ42";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ message: "Please submit JSON." }, { status: 415 });
  }
  const rateKey = `login:${getClientIp(request)}`;
  const limit = consumeRateLimit(rateKey, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 4_096);
  } catch (error) {
    return error instanceof BodyTooLargeError
      ? NextResponse.json({ message: "Request is too large." }, { status: 413 })
      : NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: INVALID_CREDENTIALS }, { status: 400 });
  }
  const { email, password } = parsed.data;

  try {
    await connectToDatabase();
    const admin = await AdminModel.findOne({ email }).select("+password name email role");

    const passwordMatches = await bcrypt.compare(
      password,
      admin?.password ?? DUMMY_HASH,
    );

    if (!admin || !passwordMatches) {
      return NextResponse.json({ message: INVALID_CREDENTIALS }, { status: 401 });
    }

    resetRateLimit(rateKey);

    const token = await signSession({ sub: admin._id.toString(), role: admin.role });
    const response = NextResponse.json({
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json(
      { message: "Login is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
