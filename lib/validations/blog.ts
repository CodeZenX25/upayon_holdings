import { z } from "zod";

export const blogSeoSchema = z.object({
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(320).optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated slug."),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().min(1),
  coverImage: z.string().trim().url(),
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  author: z.string().trim().min(1),
  isPublished: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
  seo: blogSeoSchema.default({}),
});

export type BlogInput = z.infer<typeof blogSchema>;
