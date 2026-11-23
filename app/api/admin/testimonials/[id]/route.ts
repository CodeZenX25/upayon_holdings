import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { TestimonialModel } from "@/models";
import { testimonialSchema } from "@/lib/validations";
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

    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await TestimonialModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Testimonial PUT [id] error:", error);
    return NextResponse.json(
      { message: "Failed to update testimonial." },
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
    const deleted = await TestimonialModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Delete photo from Cloudinary if set
    if (deleted.photo) {
      deleteMultipleFromCloudinary([deleted.photo]).catch((err) =>
        console.error("Cloudinary testimonial photo cleanup error:", err)
      );
    }

    return NextResponse.json({
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Testimonial DELETE [id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete testimonial." },
      { status: 500 }
    );
  }
}
