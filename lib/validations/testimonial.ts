import { z } from "zod";
import { parseVideo } from "@/lib/video";

/** Optional URL where an empty string (cleared field) means "none". */
const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(z.string().url(message).optional())
    .optional();

/** Optional text where an empty string means "none". */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || undefined)
    .optional();

/**
 * Two kinds of testimonial:
 *  - Written: name, project and quote are required.
 *  - Video: only the video is required — the site shows just the video.
 */
export const testimonialSchema = z
  .object({
    name: optionalText(120),
    photo: optionalUrl("Photo must be a full image link."),
    projectName: optionalText(160),
    message: optionalText(2000),
    rating: z.number().int().min(1).max(5).default(5),
    videoUrl: optionalUrl("Video must be a full link.").refine(
      (url) => !url || parseVideo(url) !== null,
      "Use a YouTube link (youtube.com / youtu.be) or upload a video file.",
    ),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.videoUrl) return;
    const required = [
      ["name", "Client name is required (or add a video)."],
      ["projectName", "Project name is required (or add a video)."],
      ["message", "Testimonial quote is required (or add a video)."],
    ] as const;
    for (const [key, message] of required) {
      if (!data[key]) ctx.addIssue({ code: "custom", path: [key], message });
    }
  });

export type TestimonialInput = z.infer<typeof testimonialSchema>;