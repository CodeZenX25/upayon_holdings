import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { BlogModel } from "@/models";
import { blogSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status === "published") {
      filter.isPublished = true;
    } else if (status === "draft") {
      filter.isPublished = false;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      BlogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Blogs GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs." },
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

    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const existing = await BlogModel.findOne({ slug: parsed.data.slug });
    if (existing) {
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

    const blog = await BlogModel.create(payload);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Blogs POST error:", error);
    return NextResponse.json(
      { message: "Failed to create blog post." },
      { status: 500 }
    );
  }
}
