import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { BlogModel } from "@/models";
import { blogSchema } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const blog = await BlogModel.findById(id).lean();

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Blog GET [id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog post." },
      { status: 500 }
    );
  }
}

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

    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const existingWithSlug = await BlogModel.findOne({
      slug: parsed.data.slug,
      _id: { $ne: id },
    });
    if (existingWithSlug) {
      return NextResponse.json(
        { message: "A blog with this slug already exists." },
        { status: 409 }
      );
    }

    const payload = {
      ...parsed.data,
      publishedAt:
        parsed.data.isPublished && !parsed.data.publishedAt
          ? new Date()
          : parsed.data.publishedAt,
    };

    const updated = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Blog PUT [id] error:", error);
    return NextResponse.json(
      { message: "Failed to update blog post." },
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
    const deleted = await BlogModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // Delete cover image from Cloudinary
    deleteMultipleFromCloudinary([deleted.coverImage]).catch((err) =>
      console.error("Cloudinary blog cover image cleanup error:", err)
    );

    return NextResponse.json({ message: "Blog post deleted successfully." });
  } catch (error) {
    console.error("Blog DELETE [id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete blog post." },
      { status: 500 }
    );
  }
}
