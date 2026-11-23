import { z } from "zod";

const socialLinkSchema = z.object({
  _id: z.any().optional(),
  platform: z.string().trim().min(1),
  url: z.string().trim().min(1),
});

const siteStatsSchema = z.object({
  years: z.coerce.number().int().min(0).default(0),
  completed: z.coerce.number().int().min(0).default(0),
  ongoing: z.coerce.number().int().min(0).default(0),
  families: z.coerce.number().int().min(0).default(0),
});

const heroSlideSchema = z.object({
  _id: z.any().optional(),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  image: z.string().trim().min(1),
  videoUrl: z.string().trim().optional(),
  mediaType: z.enum(["image", "video"]).default("image"),
  buttonText: z.string().trim().optional(),
  buttonUrl: z.string().trim().optional(),
  order: z.coerce.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  _id: z.any().optional(),
  __v: z.any().optional(),
  singletonKey: z.any().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().or(z.literal("")).optional(),
  address: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  socialLinks: z.array(socialLinkSchema).default([]),
  stats: siteStatsSchema.default({
    years: 0,
    completed: 0,
    ongoing: 0,
    families: 0,
  }),
  heroSlides: z.array(heroSlideSchema).default([]),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
