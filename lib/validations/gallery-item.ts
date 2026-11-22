import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid project ID.");

export const galleryItemSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.enum(["ongoing", "completed", "interior", "events", "video"]),
  imageUrl: z.string().trim().url(),
  videoUrl: z.string().trim().url().optional(),
  project: objectIdSchema.optional(),
  order: z.number().int().default(0),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
