import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { TestimonialModel } from "@/models";
import { testimonialSchema, validationErrorBody } from "@/lib/validations";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

/** Optional media fields: when cleared in the form they must be removed from the document. */
const CLEARABLE = ["photo", "videoUrl", "name", "projectName", "message"] as const;

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
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }

    const cleared = CLEARABLE.filter((key) => parsed.data[key] === undefined);
    const set = Object.fromEntries(
      Object.entries(parsed.data).filter(([, value]) => value !== undefined),
    );
    const unset = Object.fromEntries(cleared.map((key) => [key, 1]));
    const updated = await TestimonialModel.findByIdAndUpdate(
      id,
      { $set: set, ...(cleared.length ? { $unset: unset } : {}) },
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    revalidatePath("/");
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

    // Remove uploaded photo / video from Cloudinary (YouTube links are skipped automatically)
    deleteMultipleFromCloudinary([deleted.photo, deleted.videoUrl]).catch((err) =>
      console.error("Cloudinary testimonial media cleanup error:", err)
    );

    revalidatePath("/");
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
