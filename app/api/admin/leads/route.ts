import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import { LeadModel } from "@/models";

export async function GET(request: NextRequest) {
  const auth = await requirePermission("leads:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const inquiryType = searchParams.get("inquiryType") || "all";
    const isExport = searchParams.get("export") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(500, parseInt(searchParams.get("limit") || "10", 10)));

    const filter: Record<string, unknown> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (inquiryType && inquiryType !== "all") {
      filter.inquiryType = inquiryType;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    if (isExport) {
      const allMatchingLeads = await LeadModel.find(filter)
        .sort({ createdAt: -1 })
        .populate("project", "title")
        .lean();
      return NextResponse.json({ leads: allMatchingLeads });
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      LeadModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("project", "title slug")
        .lean(),
      LeadModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Leads GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch leads." },
      { status: 500 }
    );
  }
}
