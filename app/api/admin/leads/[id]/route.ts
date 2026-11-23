import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { LeadModel } from "@/models";
import { z } from "zod";

const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  notes: z.string().max(5000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("leads:update");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await LeadModel.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    )
      .populate("project", "title slug")
      .lean();

    if (!updated) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Lead PATCH [id] error:", error);
    return NextResponse.json(
      { message: "Failed to update lead." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("leads:delete");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await LeadModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead deleted successfully." });
  } catch (error) {
    console.error("Lead DELETE [id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete lead." },
      { status: 500 }
    );
  }
}
