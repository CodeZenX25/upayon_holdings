import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface Banner {
  title: string;
  subtitle?: string;
  image: string;
  videoUrl?: string;
  mediaType: "image" | "video";
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  backgroundColor?: string;
  textColor?: string;
}

const bannerSchema = new Schema<Banner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    videoUrl: { type: String, trim: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    buttonText: { type: String, trim: true },
    buttonUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0, validate: Number.isInteger },
    backgroundColor: { type: String, default: "#000000", trim: true },
    textColor: { type: String, default: "#ffffff", trim: true },
  },
  { timestamps: true }
);

export type BannerDocument = HydratedDocument<Banner> & {
  createdAt: Date;
  updatedAt: Date;
};

export const BannerModel =
  (mongoose.models.Banner as Model<Banner> | undefined) ??
  mongoose.model<Banner>("Banner", bannerSchema);
