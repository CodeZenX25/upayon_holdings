import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminModel, type AdminRole } from "@/models";
import { hasPermission, type Permission } from "./permissions";
import { SESSION_COOKIE, verifySession } from "./session";

export interface CurrentAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

/**
 * Resolves the signed-in admin from the session cookie AND the database, so a
 * deleted admin or a changed role takes effect immediately (the JWT alone is
 * only trusted by middleware for routing).
 */
// `cache` dedupes the DB lookup when a layout and page both call this in one request.
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const cookieStore = await cookies();
  const claims = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!claims) return null;

  await connectToDatabase();
  const admin = await AdminModel.findById(claims.sub)
    .select("name email role")
    .lean();
  if (!admin) return null;

  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
});

type AuthResult =
  | { ok: true; admin: CurrentAdmin }
  | { ok: false; response: NextResponse };

/**
 * Route Handler guard.
 *
 * ```ts
 * const auth = await requirePermission("content:delete");
 * if (!auth.ok) return auth.response;
 * ```
 */
export async function requirePermission(permission?: Permission): Promise<AuthResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Authentication required." }, { status: 401 }),
    };
  }
  if (permission && !hasPermission(admin.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "You do not have permission to perform this action." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, admin };
}

/** Same check for Server Actions / Server Components: throws instead of returning a response. */
export async function assertPermission(permission?: Permission): Promise<CurrentAdmin> {
  const result = await requirePermission(permission);
  if (!result.ok) {
    throw new Error(result.response.status === 401 ? "Unauthorized" : "Forbidden");
  }
  return result.admin;
}
