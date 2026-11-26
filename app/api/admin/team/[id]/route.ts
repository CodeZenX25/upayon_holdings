import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { TeamMemberModel } from "@/models";
import { teamMemberSchema, validationErrorBody } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const parsed = teamMemberSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }

    // A cleared photo must be removed from the document, not left as-is.
    const { photo, ...rest } = parsed.data;
    const updated = await TeamMemberModel.findByIdAndUpdate(
      id,
      photo ? { $set: { ...rest, photo } } : { $set: rest, $unset: { photo: 1 } },
      { returnDocument: "after", runValidators: true },
    );
    if (!updated) return NextResponse.json({ message: "Team member not found" }, { status: 404 });

    revalidatePath("/about");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Team PUT error:", error);
    return NextResponse.json({ message: "Failed to update team member." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("content:delete");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await TeamMemberModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Team member not found" }, { status: 404 });

    deleteMultipleFromCloudinary([deleted.photo]).catch((err) =>
      console.error("Cloudinary team photo cleanup error:", err),
    );
    revalidatePath("/about");
    return NextResponse.json({ message: "Team member removed." });
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete team member." }, { status: 500 });
  }
}
