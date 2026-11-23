import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { GalleryItemModel } from "@/models";
import { galleryItemSchema } from "@/lib/validations";
import { z } from "zod";

const bulkCreateSchema = z.object({
  items: z.array(galleryItemSchema),
});

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const items = await GalleryItemModel.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate("project", "title slug")
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch gallery items." },
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

    // Check if bulk insert
    if (body.items && Array.isArray(body.items)) {
      const parsedBulk = bulkCreateSchema.safeParse(body);
      if (!parsedBulk.success) {
        return NextResponse.json(
          { message: "Validation error", errors: parsedBulk.error.format() },
          { status: 400 }
        );
      }

      // Find current max order
      const highestOrderDoc = await GalleryItemModel.findOne()
        .sort({ order: -1 })
        .select("order")
        .lean();
      const startOrder = (highestOrderDoc?.order ?? -1) + 1;

      const toInsert = parsedBulk.data.items.map((item, idx) => ({
        ...item,
        order: item.order ?? startOrder + idx,
      }));

      const created = await GalleryItemModel.insertMany(toInsert);
      return NextResponse.json({ items: created }, { status: 201 });
    }

    // Single item insert
    const parsed = galleryItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const created = await GalleryItemModel.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { message: "Failed to create gallery item(s)." },
      { status: 500 }
    );
  }
}

// Bulk update order (drag-and-drop reorder)
export async function PUT(request: Request) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid reorder payload." },
        { status: 400 }
      );
    }

    const bulkOps = parsed.data.items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await GalleryItemModel.bulkWrite(bulkOps);

    return NextResponse.json({ message: "Gallery order updated successfully." });
  } catch (error) {
    console.error("Gallery PUT reorder error:", error);
    return NextResponse.json(
      { message: "Failed to update gallery order." },
      { status: 500 }
    );
  }
}
