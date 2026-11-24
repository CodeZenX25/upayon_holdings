import { z } from "zod";

export const bannerSchema = z.object({
  _id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required").max(200),
  subtitle: z.string().trim().max(500).nullable().optional().transform(val => val || undefined),
  image: z.string().trim().url("Image URL must be valid"),
  videoUrl: z.string().trim().url("Video URL must be valid").optional(),
  mediaType: z.enum(["image", "video"]).default("image"),
  buttonText: z.string().trim().max(50).optional(),
  buttonUrl: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  backgroundColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color (e.g. #000000)")
    .default("#000000"),
  textColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color (e.g. #ffffff)")
    .default("#ffffff"),
});

export const bannerArraySchema = z.array(bannerSchema);
export type BannerInput = z.infer<typeof bannerSchema>;
