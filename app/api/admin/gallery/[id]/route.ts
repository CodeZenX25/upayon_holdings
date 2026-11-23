import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { GalleryItemModel } from "@/models";
import { galleryItemSchema } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const parsed = galleryItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await GalleryItemModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gallery PUT [id] error:", error);
    return NextResponse.json(
      { message: "Failed to update gallery item." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("content:delete");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await GalleryItemModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    deleteMultipleFromCloudinary([deleted.imageUrl, deleted.videoUrl]).catch((err) =>
      console.error("Cloudinary gallery item cleanup error:", err)
    );

    return NextResponse.json({ message: "Gallery item deleted successfully." });
  } catch (error) {
    console.error("Gallery DELETE [id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete gallery item." },
      { status: 500 }
    );
  }
}
