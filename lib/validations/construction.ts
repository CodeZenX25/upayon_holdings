import { z } from "zod";

/** Optional text where an empty string (cleared field) means "none". */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || undefined)
    .optional();

export const constructionSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated slug (e.g. green-crescent-tower)."),
  status: z.enum(["ongoing", "upcoming", "completed"]),
  constructionType: z
    .enum(["residential", "commercial", "industrial", "institutional", "mixed-use"])
    .default("residential"),
  projectCode: optionalText(60),
  location: z.string().trim().min(1, "Location is required.").max(120),
  address: optionalText(240),
  buildingHeight: optionalText(120),
  description: z.string().trim().max(10000).default(""),
  coverImage: z.string().trim().url("Cover image is required."),
  images: z.array(z.string().trim().url()).max(40).default([]),
  brochureUrl: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.string().url("Brochure must be a full link.").optional())
    .optional(),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export type ConstructionInput = z.infer<typeof constructionSchema>;
