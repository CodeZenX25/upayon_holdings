import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { BannerModel } from "@/models/banner";
import { bannerSchema } from "@/lib/validations/banner";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const banner = await BannerModel.findById(id).lean();

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch banner." },
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
    const { id } = await params;
    await connectToDatabase();
    const body = await request.json();

    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
        .join("; ");
      return NextResponse.json(
        { message: `Validation error: ${errorMsg}`, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { ...dataToSave } = parsed.data;
    const banner = await BannerModel.findByIdAndUpdate(id, dataToSave, {
      new: true,
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update banner." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectToDatabase();
    const banner = await BannerModel.findById(id);

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found." },
        { status: 404 }
      );
    }

    if (banner.image && banner.image.includes("res.cloudinary.com")) {
      const resourceType = banner.mediaType === "video" ? "video" : "image";
      const deleted = await deleteFromCloudinary(banner.image, resourceType);
      if (!deleted) {
        console.warn(`Failed to delete Cloudinary asset: ${banner.image}`);
      }
    }

    await BannerModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Banner deleted successfully." });
  } catch (error) {
    console.error("Banner DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete banner." },
      { status: 500 }
    );
  }
}
