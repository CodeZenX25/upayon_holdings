import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { ConstructionModel } from "@/models";
import { constructionSchema, validationErrorBody } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";
import { revalidateConstructionPages } from "@/lib/constructions";

/** Optional fields: when cleared in the form they must be removed from the document. */
const CLEARABLE = ["projectCode", "address", "buildingHeight", "brochureUrl"] as const;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const parsed = constructionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }

    if (await ConstructionModel.exists({ slug: parsed.data.slug, _id: { $ne: id } })) {
      return NextResponse.json({ message: "A construction with this slug already exists." }, { status: 409 });
    }

    const cleared = CLEARABLE.filter((key) => parsed.data[key] === undefined);
    const set = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined));
    const updated = await ConstructionModel.findByIdAndUpdate(
      id,
      {
        $set: set,
        ...(cleared.length ? { $unset: Object.fromEntries(cleared.map((key) => [key, 1])) } : {}),
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) return NextResponse.json({ message: "Construction not found" }, { status: 404 });

    revalidateConstructionPages();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Construction PUT error:", error);
    return NextResponse.json({ message: "Failed to update construction." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission("content:delete");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await ConstructionModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Construction not found" }, { status: 404 });

    deleteMultipleFromCloudinary([deleted.coverImage, ...(deleted.images ?? []), deleted.brochureUrl]).catch((err) =>
      console.error("Cloudinary construction media cleanup error:", err),
    );

    revalidateConstructionPages();
    return NextResponse.json({ message: "Construction deleted successfully." });
  } catch (error) {
    console.error("Construction DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete construction." }, { status: 500 });
  }
}
