import "server-only";
import { connectToDatabase } from "@/lib/db";
import { TestimonialModel, type Testimonial } from "@/models";

export interface TestimonialView {
  id: string;
  name?: string;
  photo?: string;
  projectName?: string;
  message?: string;
  rating: number;
  videoUrl?: string;
}

/** Shown only until the first testimonial is added in the admin panel. */
const fallback: TestimonialView[] = [
  {
    id: "sample",
    name: "Tariqul Islam Chowdhury",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
    projectName: "Shareholder, Upayon Uttara Crest",
    message:
      "Investing in the land share of Upayon Uttara Crest was seamless. Having the land registered directly in our name gave us complete peace of mind — the progress reports are always clear and on time.",
    rating: 5,
  },
];

type TestimonialLean = Testimonial & { _id: { toString(): string } };

/** Active testimonials for the public site, newest first. */
export async function getActiveTestimonials(limit = 8): Promise<TestimonialView[]> {
  try {
    await connectToDatabase();
    const docs = await TestimonialModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<TestimonialLean[]>();
    if (docs.length === 0) return fallback;
    return docs
      .map((doc) => ({
        id: doc._id.toString(),
        name: doc.name || undefined,
        photo: doc.photo || undefined,
        projectName: doc.projectName || undefined,
        message: doc.message || undefined,
        rating: doc.rating ?? 5,
        videoUrl: doc.videoUrl || undefined,
      }))
      // Skip anything that has neither a video nor a quote to show
      .filter((t) => t.videoUrl || t.message);
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return fallback;
  }
}
