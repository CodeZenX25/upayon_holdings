import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  // Login only checks shape; strength rules live in the admin schema.
  password: z
    .string()
    .min(1)
    .refine(
      (password) => new TextEncoder().encode(password).byteLength <= 72,
      "Password is too long.",
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;
