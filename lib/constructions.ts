import "server-only";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import {
  ConstructionModel,
  type Construction,
  type ConstructionStatus,
  type ConstructionType,
} from "@/models";

export interface ConstructionView {
  id: string;
  title: string;
  slug: string;
  status: ConstructionStatus;
  constructionType: ConstructionType;
  projectCode?: string;
  location: string;
  address?: string;
  buildingHeight?: string;
  description: string;
  coverImage: string;
  images: string[];
  brochureUrl?: string;
}

export const constructionStatusLabel: Record<ConstructionStatus, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

export const constructionTypeLabel: Record<ConstructionType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  institutional: "Institutional",
  "mixed-use": "Mixed-use",
};

type ConstructionLean = Construction & { _id: { toString(): string } };

function toView(doc: ConstructionLean): ConstructionView {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    constructionType: doc.constructionType ?? "residential",
    projectCode: doc.projectCode || undefined,
    location: doc.location,
    address: doc.address || undefined,
    buildingHeight: doc.buildingHeight || undefined,
    description: doc.description ?? "",
    coverImage: doc.coverImage,
    images: doc.images ?? [],
    brochureUrl: doc.brochureUrl || undefined,
  };
}

/** Published constructions, in admin-defined order. */
export async function getConstructions(): Promise<ConstructionView[]> {
  try {
    await connectToDatabase();
    const docs = await ConstructionModel.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean<ConstructionLean[]>();
    return docs.map(toView);
  } catch (error) {
    console.error("Failed to load constructions:", error);
    return [];
  }
}

export async function getConstructionBySlug(slug: string): Promise<ConstructionView | null> {
  try {
    await connectToDatabase();
    const doc = await ConstructionModel.findOne({ slug, isPublished: true }).lean<ConstructionLean>();
    return doc ? toView(doc) : null;
  } catch (error) {
    console.error("Failed to load construction:", error);
    return null;
  }
}

export function revalidateConstructionPages() {
  revalidatePath("/construction");
  revalidatePath("/construction/[slug]", "page");
}
