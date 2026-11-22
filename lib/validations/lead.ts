import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid project ID.");

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().optional(),
  project: objectIdSchema.optional(),
  inquiryType: z.enum(["land-share", "flat-share", "general", "site-visit"]),
  message: z.string().trim().min(1).max(5000),
  status: z.enum(["new", "contacted", "closed"]).default("new"),
  notes: z.string().trim().max(5000).default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
