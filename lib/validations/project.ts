import { z } from "zod";

const projectFeatureSchema = z.object({
  name: z.string().trim().min(1),
  icon: z.string().trim().min(1),
});

const projectFloorPlanSchema = z.object({
  title: z.string().trim().min(1),
  image: z.string().trim().url(),
});

const projectProgressUpdateSchema = z.object({
  date: z.coerce.date(),
  note: z.string().trim().min(1),
  images: z.array(z.string().trim().url()).default([]),
});

export const projectSeoSchema = z.object({
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(320).optional(),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated slug."),
  status: z.enum(["ongoing", "upcoming", "completed"]),
  type: z.enum(["land-share", "flat-share"]),
  location: z.string().trim().min(1),
  address: z.string().trim().min(1),
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().min(1),
  coverImage: z.string().trim().url(),
  images: z.array(z.string().trim().url()).default([]),
  landArea: z.string().trim().optional(),
  floors: z.number().int().min(0).optional(),
  totalUnits: z.number().int().min(0).optional(),
  flatSizes: z.array(z.string().trim().min(1)).default([]),
  facing: z.string().trim().optional(),
  handoverDate: z.coerce.date().optional(),
  features: z.array(projectFeatureSchema).default([]),
  floorPlans: z.array(projectFloorPlanSchema).default([]),
  mapEmbedUrl: z.string().trim().url().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  progressUpdates: z.array(projectProgressUpdateSchema).default([]),
  brochureUrl: z.string().trim().url().optional(),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  seo: projectSeoSchema.default({}),
});

export type ProjectInput = z.infer<typeof projectSchema>;
