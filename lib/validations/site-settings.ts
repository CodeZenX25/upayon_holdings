import { z } from "zod";

const socialLinkSchema = z.object({
  platform: z.string().trim().min(1),
  url: z.string().trim().url(),
});

const siteStatsSchema = z.object({
  years: z.number().int().min(0).default(0),
  completed: z.number().int().min(0).default(0),
  ongoing: z.number().int().min(0).default(0),
  families: z.number().int().min(0).default(0),
});

const heroSlideSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  image: z.string().trim().url(),
  buttonText: z.string().trim().optional(),
  buttonUrl: z.string().trim().url().optional(),
  order: z.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
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
