import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { ProjectModel } from "@/models";
import { projectSchema } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";
import { revalidateProjectPages } from "@/lib/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await params;
    const project = await ProjectModel.findById(id).lean();

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET [id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch project." },
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

    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    // Check slug uniqueness with other projects
    const existingWithSlug = await ProjectModel.findOne({
      slug: parsed.data.slug,
      _id: { $ne: id },
    });
    if (existingWithSlug) {
      return NextResponse.json(
        { message: "A project with this slug already exists." },
        { status: 409 }
      );
    }

    const updated = await ProjectModel.findByIdAndUpdate(id, parsed.data, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    revalidateProjectPages();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Project PUT [id] error:", error);
    return NextResponse.json(
      { message: "Failed to update project." },
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
    const deleted = await ProjectModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Delete associated images from Cloudinary
    const imagesToDelete: string[] = [
      deleted.coverImage,
      ...(deleted.images || []),
      ...(deleted.videos || []),
      ...(deleted.floorPlans?.map((fp) => fp.image) || []),
    ];
    deleteMultipleFromCloudinary(imagesToDelete).catch((err) =>
      console.error("Cloudinary project images cleanup error:", err)
    );

    revalidateProjectPages();
    return NextResponse.json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Project DELETE [id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete project." },
      { status: 500 }
    );
  }
}
