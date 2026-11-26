import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  designation: z.string().trim().min(1, "Designation is required.").max(120),
  photo: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.string().url("Photo must be a full image link.").optional())
    .optional(),
  group: z.enum(["leadership", "department"]).default("department"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
