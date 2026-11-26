import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

/** Written testimonials need name/project/message; video testimonials only need videoUrl (enforced in Zod). */
export interface Testimonial {
  name?: string;
  photo?: string;
  projectName?: string;
  message?: string;
  rating: number;
  /** Optional video: a YouTube link or an uploaded (Cloudinary) video file. */
  videoUrl?: string;
  isActive: boolean;
}

const testimonialSchema = new Schema<Testimonial>(
  {
    name: { type: String, trim: true },
    photo: { type: String, trim: true },
    projectName: { type: String, trim: true },
    message: { type: String, trim: true },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
      validate: Number.isInteger,
    },
    videoUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type TestimonialDocument = HydratedDocument<Testimonial> & {
  createdAt: Date;
  updatedAt: Date;
};

// Recompile on hot reload in development so schema edits take effect without a restart.
if (process.env.NODE_ENV !== "production" && mongoose.models.Testimonial) {
  mongoose.deleteModel("Testimonial");
}

export const TestimonialModel =
  (mongoose.models.Testimonial as Model<Testimonial> | undefined) ??
  mongoose.model<Testimonial>("Testimonial", testimonialSchema);
