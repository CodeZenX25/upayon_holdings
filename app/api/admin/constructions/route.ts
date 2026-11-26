import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { ConstructionModel } from "@/models";
import { constructionSchema, validationErrorBody } from "@/lib/validations";
import { revalidateConstructionPages } from "@/lib/constructions";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(request: NextRequest) {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "all";

    const filter: Record<string, unknown> = {};
    if (["ongoing", "upcoming", "completed"].includes(status)) filter.status = status;
    if (search) {
      const rx = { $regex: escapeRegex(search), $options: "i" };
      filter.$or = [{ title: rx }, { location: rx }, { slug: rx }, { projectCode: rx }];
    }

    const constructions = await ConstructionModel.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ constructions });
  } catch (error) {
    console.error("Constructions GET error:", error);
    return NextResponse.json({ message: "Failed to fetch constructions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const parsed = constructionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(validationErrorBody(parsed.error), { status: 400 });
    }

    if (await ConstructionModel.exists({ slug: parsed.data.slug })) {
      return NextResponse.json({ message: "A construction with this slug already exists." }, { status: 409 });
    }

    const created = await ConstructionModel.create(parsed.data);
    revalidateConstructionPages();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Constructions POST error:", error);
    return NextResponse.json({ message: "Failed to create construction." }, { status: 500 });
  }
}
