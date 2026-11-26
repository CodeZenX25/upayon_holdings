import { z } from "zod";

const projectFeatureSchema = z.object({
  name: z.string().trim().min(1),
  icon: z.string().trim().min(1).default("check"),
});

const projectHighlightSchema = z.object({
  title: z.string().trim().min(1).max(120),
  text: z.string().trim().min(1).max(600),
});

const amenityList = z.array(z.string().trim().min(1).max(80)).max(40).default([]);

const projectAmenitiesSchema = z.object({
  interior: amenityList,
  outdoor: amenityList,
  utilities: amenityList,
  other: amenityList,
  nearby: amenityList,
});

/**
 * Spec value that may mix numbers and text, e.g. "12", "G+8", "2 (covered)".
 * Numbers are accepted for older clients and stored as text; blank → undefined.
 */
const optionalSpec = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .pipe(z.string().max(60, "Keep this under 60 characters."))
  .transform((value) => value || undefined)
  .optional();

/** Accepts a Google Maps embed URL, or the whole `<iframe src="…">` snippet copied from Google Maps. */
const mapEmbedSchema = z
  .string()
  .trim()
  .transform((value) => value.match(/src=["']([^"']+)["']/i)?.[1] ?? value)
  .pipe(z.string().url("Paste the Google Maps embed link (starts with https://)."))
  .optional();

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
  category: z.enum(["residential", "commercial", "mixed-use"]).default("residential"),
  availability: z.enum(["available", "limited", "sold-out"]).default("available"),
  location: z.string().trim().min(1),
  address: z.string().trim().min(1),
  shortDescription: z.string().trim().min(1).max(500),
  description: z.string().default(""),
  coverImage: z.string().trim().url(),
  images: z.array(z.string().trim().url()).default([]),
  videos: z.array(z.string().trim().url()).max(20).default([]),
  landArea: z.string().trim().optional(),
  projectArea: z.string().trim().max(120).optional(),
  bedrooms: optionalSpec,
  bathrooms: optionalSpec,
  verandahs: optionalSpec,
  lifts: optionalSpec,
  parking: optionalSpec,
  unitsPerFloor: optionalSpec,
  floors: optionalSpec,
  totalUnits: optionalSpec,
  flatSizes: z.array(z.string().trim().min(1)).default([]),
  facing: z.string().trim().optional(),
  handoverDate: z.coerce.date().optional(),
  features: z.array(projectFeatureSchema).default([]),
  highlights: z.array(projectHighlightSchema).max(30).default([]),
  amenities: projectAmenitiesSchema.default({
    interior: [],
    outdoor: [],
    utilities: [],
    other: [],
    nearby: [],
  }),
  floorPlans: z.array(projectFloorPlanSchema).default([]),
  mapEmbedUrl: mapEmbedSchema,
  progress: z.number().int().min(0).max(100).default(0),
  progressUpdates: z.array(projectProgressUpdateSchema).default([]),
  brochureUrl: z.string().trim().url("Brochure must be a full link (https://…).").optional(),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  seo: projectSeoSchema.default({}),
});

export type ProjectInput = z.infer<typeof projectSchema>;
