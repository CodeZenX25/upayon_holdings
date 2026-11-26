import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export type ConstructionStatus = "ongoing" | "upcoming" | "completed";
export type ConstructionType = "residential" | "commercial" | "industrial" | "institutional" | "mixed-use";

/** A building Upayon constructs (shown under Construction on the public site). */
export interface Construction {
  title: string;
  slug: string;
  status: ConstructionStatus;
  constructionType: ConstructionType;
  /** Shown as "Project ID", e.g. "UP-2025-014". */
  projectCode?: string;
  location: string;
  address?: string;
  /** Free text, e.g. "B+G+9 = 10 storied". */
  buildingHeight?: string;
  description: string;
  coverImage: string;
  images: string[];
  brochureUrl?: string;
  order: number;
  isPublished: boolean;
}

const constructionSchema = new Schema<Construction>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    status: { type: String, enum: ["ongoing", "upcoming", "completed"], required: true, index: true },
    constructionType: {
      type: String,
      enum: ["residential", "commercial", "industrial", "institutional", "mixed-use"],
      default: "residential",
    },
    projectCode: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    buildingHeight: { type: String, trim: true },
    description: { type: String, default: "" },
    coverImage: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    brochureUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type ConstructionDocument = HydratedDocument<Construction> & { createdAt: Date; updatedAt: Date };

// Recompile on hot reload in development so schema edits take effect without a restart.
if (process.env.NODE_ENV !== "production" && mongoose.models.Construction) {
  mongoose.deleteModel("Construction");
}

export const ConstructionModel =
  (mongoose.models.Construction as Model<Construction> | undefined) ??
  mongoose.model<Construction>("Construction", constructionSchema);
