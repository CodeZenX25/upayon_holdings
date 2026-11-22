import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12)
  .refine(
    (password) => new TextEncoder().encode(password).byteLength <= 72,
    "Password must not exceed 72 UTF-8 bytes.",
  );

export const adminSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: passwordSchema,
  role: z.enum(["admin", "editor"]).default("editor"),
});

export type AdminInput = z.infer<typeof adminSchema>;
