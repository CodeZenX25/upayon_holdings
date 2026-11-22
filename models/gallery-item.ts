import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type GalleryCategory =
  | "ongoing"
  | "completed"
  | "interior"
  | "events"
  | "video";

export interface GalleryItem {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  videoUrl?: string;
  project?: Types.ObjectId;
  order: number;
}

const galleryItemSchema = new Schema<GalleryItem>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["ongoing", "completed", "interior", "events", "video"],
      required: true,
      index: true,
    },
    imageUrl: { type: String, required: true, trim: true },
    videoUrl: { type: String, trim: true },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    order: { type: Number, default: 0, validate: Number.isInteger },
  },
  { timestamps: true },
);

export type GalleryItemDocument = HydratedDocument<GalleryItem> & {
  createdAt: Date;
  updatedAt: Date;
};

export const GalleryItemModel =
  (mongoose.models.GalleryItem as Model<GalleryItem> | undefined) ??
  mongoose.model<GalleryItem>("GalleryItem", galleryItemSchema);
