/**
 * JWT session primitives. Edge-runtime safe (only `jose`, no Node/DB imports)
 * so it can be shared by `middleware.ts` and Route Handlers.
 */
import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

export const SESSION_COOKIE = "upayon_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const ISSUER = "upayon-holdings";
const AUDIENCE = "upayon-admin";

const sessionClaimsSchema = z.object({
  sub: z.string().regex(/^[a-f\d]{24}$/i),
  role: z.enum(["admin", "editor"]),
});

export type SessionClaims = z.infer<typeof sessionClaimsSchema>;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

/** Returns the verified claims, or `null` for a missing/invalid/expired token. */
export async function verifySession(
  token: string | undefined,
): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["HS256"],
      requiredClaims: ["exp", "iat", "sub"],
      maxTokenAge: SESSION_MAX_AGE_SECONDS,
    });
    const parsed = sessionClaimsSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    // Browsers reject `Secure` cookies on plain http (except localhost in
    // Chromium), so only enforce it outside local development.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
