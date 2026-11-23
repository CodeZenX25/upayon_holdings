import { NextResponse } from "next/server";
import { canDelete, canManageAdmins } from "@/lib/auth/permissions";
import { getCurrentAdmin } from "@/lib/auth/server";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      {
        admin,
        permissions: {
          canDelete: canDelete(admin.role),
          canManageAdmins: canManageAdmins(admin.role),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to load current admin", error);
    return NextResponse.json({ message: "Unable to load session." }, { status: 500 });
  }
}
