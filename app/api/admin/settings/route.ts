import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { SiteSettingsModel } from "@/models";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requirePermission("settings:manage");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    let settings = await SiteSettingsModel.findOne({ singletonKey: "default" }).lean();

    if (!settings) {
      settings = await SiteSettingsModel.create({
        singletonKey: "default",
        phone: "+880 1700-000000",
        email: "info@upayonholdings.com",
        address: "Gulshan, Dhaka, Bangladesh",
        whatsapp: "+880 1700-000000",
        socialLinks: [
          { platform: "Facebook", url: "https://facebook.com/upayonholdings" },
          { platform: "LinkedIn", url: "https://linkedin.com/company/upayonholdings" },
        ],
        stats: {
          years: 10,
          completed: 15,
          ongoing: 8,
          families: 450,
        },
        heroSlides: [],
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requirePermission("settings:manage");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
        .join("; ");
      return NextResponse.json(
        { message: `Validation error: ${errorMsg}`, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { _id, __v, singletonKey, ...dataToSave } = parsed.data;

    const updated = await SiteSettingsModel.findOneAndUpdate(
      { singletonKey: "default" },
      { $set: dataToSave },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update settings." },
      { status: 500 }
    );
  }
}
