import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth/server";
import {
  ProjectModel,
  LeadModel,
  BlogModel,
  GalleryItemModel,
} from "@/models";

export async function GET() {
  const auth = await requirePermission("content:read");
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      ongoingProjects,
      upcomingProjects,
      completedProjects,
      totalProjects,
      totalLeads,
      newLeadsThisWeek,
      newLeads,
      contactedLeads,
      closedLeads,
      publishedBlogs,
      totalBlogs,
      galleryCount,
      latestLeads,
    ] = await Promise.all([
      ProjectModel.countDocuments({ status: "ongoing" }),
      ProjectModel.countDocuments({ status: "upcoming" }),
      ProjectModel.countDocuments({ status: "completed" }),
      ProjectModel.countDocuments(),
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      LeadModel.countDocuments({ status: "new" }),
      LeadModel.countDocuments({ status: "contacted" }),
      LeadModel.countDocuments({ status: "closed" }),
      BlogModel.countDocuments({ isPublished: true }),
      BlogModel.countDocuments(),
      GalleryItemModel.countDocuments(),
      LeadModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("project", "title slug")
        .lean(),
    ]);

    return NextResponse.json({
      projectStats: {
        ongoing: ongoingProjects,
        upcoming: upcomingProjects,
        completed: completedProjects,
        total: totalProjects,
      },
      leadStats: {
        total: totalLeads,
        newThisWeek: newLeadsThisWeek,
        new: newLeads,
        contacted: contactedLeads,
        closed: closedLeads,
      },
      blogStats: {
        published: publishedBlogs,
        draft: totalBlogs - publishedBlogs,
        total: totalBlogs,
      },
      galleryCount,
      latestLeads,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard metrics." },
      { status: 500 }
    );
  }
}
