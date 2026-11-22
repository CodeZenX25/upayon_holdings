import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(120),
  photo: z.string().trim().url().optional(),
  projectName: z.string().trim().min(1),
  message: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
  isActive: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
