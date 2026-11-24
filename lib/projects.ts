import "server-only";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import {
  ProjectModel,
  type Project,
  type ProjectAmenities,
  type ProjectAvailability,
  type ProjectCategory,
  type ProjectStatus,
  type ProjectType,
} from "@/models/project";

export interface ProjectView {
  id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  type: ProjectType;
  category: ProjectCategory;
  availability: ProjectAvailability;
  location: string;
  address: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  videos: string[];
  landArea?: string;
  projectArea?: string;
  floors?: number;
  totalUnits?: number;
  unitsPerFloor?: number;
  bedrooms?: number;
  bathrooms?: number;
  verandahs?: number;
  lifts?: number;
  parking?: number;
  flatSizes: string[];
  facing?: string;
  handoverDate?: string;
  keyFeatures: string[];
  highlights: { title: string; text: string }[];
  amenities: ProjectAmenities;
  floorPlans: { title: string; image: string }[];
  mapEmbedUrl?: string;
  progress: number;
  brochureUrl?: string;
  seo: { metaTitle?: string; metaDescription?: string };
}

type ProjectLean = Project & { _id: { toString(): string } };

const emptyAmenities: ProjectAmenities = {
  interior: [],
  outdoor: [],
  utilities: [],
  other: [],
  nearby: [],
};

function toView(doc: ProjectLean): ProjectView {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    status: doc.status,
    type: doc.type,
    category: doc.category ?? "residential",
    availability: doc.availability ?? "available",
    location: doc.location,
    address: doc.address,
    shortDescription: doc.shortDescription,
    description: doc.description ?? "",
    coverImage: doc.coverImage,
    images: doc.images ?? [],
    videos: doc.videos ?? [],
    landArea: doc.landArea || undefined,
    projectArea: doc.projectArea || undefined,
    floors: doc.floors ?? undefined,
    totalUnits: doc.totalUnits ?? undefined,
    unitsPerFloor: doc.unitsPerFloor ?? undefined,
    bedrooms: doc.bedrooms ?? undefined,
    bathrooms: doc.bathrooms ?? undefined,
    verandahs: doc.verandahs ?? undefined,
    lifts: doc.lifts ?? undefined,
    parking: doc.parking ?? undefined,
    flatSizes: doc.flatSizes ?? [],
    facing: doc.facing || undefined,
    handoverDate: doc.handoverDate ? new Date(doc.handoverDate).toISOString() : undefined,
    keyFeatures: (doc.features ?? []).map((f) => f.name).filter(Boolean),
    highlights: (doc.highlights ?? []).map(({ title, text }) => ({ title, text })),
    amenities: { ...emptyAmenities, ...(doc.amenities ?? {}) },
    floorPlans: (doc.floorPlans ?? []).map(({ title, image }) => ({ title, image })),
    mapEmbedUrl: doc.mapEmbedUrl || undefined,
    progress: doc.progress ?? 0,
    brochureUrl: doc.brochureUrl || undefined,
    seo: { metaTitle: doc.seo?.metaTitle, metaDescription: doc.seo?.metaDescription },
  };
}

export async function getProjects(limit?: number): Promise<ProjectView[]> {
  try {
    await connectToDatabase();
    const query = ProjectModel.find().sort({ order: 1, createdAt: -1 });
    if (limit) query.limit(limit);
    const docs = await query.lean<ProjectLean[]>();
    return docs.map(toView);
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  try {
    await connectToDatabase();
    const doc = await ProjectModel.findOne({ slug }).lean<ProjectLean>();
    return doc ? toView(doc) : null;
  } catch (error) {
    console.error("Failed to load project:", error);
    return null;
  }
}

export function revalidateProjectPages() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
}
