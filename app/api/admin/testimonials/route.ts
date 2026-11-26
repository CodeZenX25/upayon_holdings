import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { TestimonialModel } from "@/models";
import { testimonialSchema, validationErrorBody } from "@/lib/validations";

export async function GET() {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const testimonials = await TestimonialModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }

    const created = await TestimonialModel.create(parsed.data);
    revalidatePath("/");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json(
      { message: "Failed to create testimonial." },
      { status: 500 }
    );
  }
}
