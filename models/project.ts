import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type ProjectStatus = "ongoing" | "upcoming" | "completed";
export type ProjectType = "land-share" | "flat-share";

export interface ProjectFeature {
  name: string;
  icon: string;
}

export interface ProjectFloorPlan {
  title: string;
  image: string;
}

export interface ProjectProgressUpdate {
  date: Date;
  note: string;
  images: string[];
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Project {
  title: string;
  slug: string;
  status: ProjectStatus;
  type: ProjectType;
  location: string;
  address: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  landArea?: string;
  floors?: number;
  totalUnits?: number;
  flatSizes: string[];
  facing?: string;
  handoverDate?: Date;
  features: ProjectFeature[];
  floorPlans: ProjectFloorPlan[];
  mapEmbedUrl?: string;
  progress: number;
  progressUpdates: ProjectProgressUpdate[];
  brochureUrl?: string;
  isFeatured: boolean;
  order: number;
  seo: ProjectSeo;
}

const projectFeatureSchema = new Schema<ProjectFeature>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectFloorPlanSchema = new Schema<ProjectFloorPlan>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectProgressUpdateSchema = new Schema<ProjectProgressUpdate>(
  {
    date: { type: Date, required: true },
    note: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
  },
  { _id: false },
);

const projectSeoSchema = new Schema<ProjectSeo>(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema<Project>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "completed"],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["land-share", "flat-share"],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    landArea: { type: String, trim: true },
    floors: { type: Number, min: 0, validate: Number.isInteger },
    totalUnits: { type: Number, min: 0, validate: Number.isInteger },
    flatSizes: { type: [String], default: [] },
    facing: { type: String, trim: true },
    handoverDate: { type: Date },
    features: { type: [projectFeatureSchema], default: [] },
    floorPlans: { type: [projectFloorPlanSchema], default: [] },
    mapEmbedUrl: { type: String, trim: true },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      validate: Number.isInteger,
    },
    progressUpdates: { type: [projectProgressUpdateSchema], default: [] },
    brochureUrl: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, validate: Number.isInteger },
    seo: { type: projectSeoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

projectSchema.index({ slug: 1 }, { unique: true });

export type ProjectDocument = HydratedDocument<Project> & {
  createdAt: Date;
  updatedAt: Date;
};

export const ProjectModel =
  (mongoose.models.Project as Model<Project> | undefined) ??
  mongoose.model<Project>("Project", projectSchema);
