import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface Testimonial {
  name: string;
  photo?: string;
  projectName: string;
  message: string;
  rating: number;
  isActive: boolean;
}

const testimonialSchema = new Schema<Testimonial>(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    projectName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: Number.isInteger,
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type TestimonialDocument = HydratedDocument<Testimonial> & {
  createdAt: Date;
  updatedAt: Date;
};

export const TestimonialModel =
  (mongoose.models.Testimonial as Model<Testimonial> | undefined) ??
  mongoose.model<Testimonial>("Testimonial", testimonialSchema);
