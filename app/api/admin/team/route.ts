import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { TeamMemberModel } from "@/models";
import { teamMemberSchema, validationErrorBody } from "@/lib/validations";

export async function GET() {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const members = await TeamMemberModel.find().sort({ group: -1, order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ message: "Failed to fetch team members." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const parsed = teamMemberSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }
    const created = await TeamMemberModel.create(parsed.data);
    revalidatePath("/about");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json({ message: "Failed to add team member." }, { status: 500 });
  }
}
