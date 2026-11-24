import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { BannerModel } from "@/models/banner";
import { bannerSchema, bannerArraySchema } from "@/lib/validations/banner";

export async function GET() {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const banners = await BannerModel.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Banners GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch banners." },
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

    const banner = await BannerModel.create(dataToSave);

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Banners POST error:", error);
    return NextResponse.json(
      { message: "Failed to create banner." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (Array.isArray(body)) {
      const parsed = bannerArraySchema.safeParse(body);
      if (!parsed.success) {
        const errorMsg = parsed.error.issues
          .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
          .join("; ");
        return NextResponse.json(
          { message: `Validation error: ${errorMsg}` },
          { status: 400 }
        );
      }

      await Promise.all(
        parsed.data.map((item) => {
          if (item._id) {
            return BannerModel.findByIdAndUpdate(item._id, item, { new: true });
          }
          return BannerModel.create(item);
        })
      );

      const banners = await BannerModel.find().sort({ order: 1 }).lean();
      return NextResponse.json(banners);
    } else {
      const parsed = bannerSchema.safeParse(body);
      if (!parsed.success) {
        const errorMsg = parsed.error.issues
          .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
          .join("; ");
        return NextResponse.json(
          { message: `Validation error: ${errorMsg}` },
          { status: 400 }
        );
      }

      const { _id, ...dataToSave } = parsed.data;
      if (!_id) {
        return NextResponse.json(
          { message: "Banner ID is required for update." },
          { status: 400 }
        );
      }
      const banner = await BannerModel.findByIdAndUpdate(_id, dataToSave, {
        new: true,
      });

      if (!banner) {
        return NextResponse.json(
          { message: "Banner not found." },
          { status: 404 }
        );
      }

      return NextResponse.json(banner);
    }
  } catch (error) {
    console.error("Banners PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update banners." },
      { status: 500 }
    );
  }
}
