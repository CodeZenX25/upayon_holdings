import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type ProjectStatus = "ongoing" | "upcoming" | "completed";
export type ProjectType = "land-share" | "flat-share";
export type ProjectCategory = "residential" | "commercial" | "mixed-use";
export type ProjectAvailability = "available" | "limited" | "sold-out";

export interface ProjectHighlight {
  title: string;
  text: string;
}

export interface ProjectAmenities {
  interior: string[];
  outdoor: string[];
  utilities: string[];
  other: string[];
  nearby: string[];
}

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
  category: ProjectCategory;
  availability: ProjectAvailability;
  location: string;
  address: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  videos: string[];
  landArea?: string;
  projectArea?: string;
  /* Free text so admins can write "3", "G+8", "2 (covered)", etc. Older documents may still hold numbers. */
  bedrooms?: string;
  bathrooms?: string;
  verandahs?: string;
  lifts?: string;
  parking?: string;
  unitsPerFloor?: string;
  floors?: string;
  totalUnits?: string;
  flatSizes: string[];
  facing?: string;
  handoverDate?: Date;
  features: ProjectFeature[];
  highlights: ProjectHighlight[];
  amenities: ProjectAmenities;
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

const projectHighlightSchema = new Schema<ProjectHighlight>(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectAmenitiesSchema = new Schema<ProjectAmenities>(
  {
    interior: { type: [String], default: [] },
    outdoor: { type: [String], default: [] },
    utilities: { type: [String], default: [] },
    other: { type: [String], default: [] },
    nearby: { type: [String], default: [] },
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
    category: {
      type: String,
      enum: ["residential", "commercial", "mixed-use"],
      default: "residential",
    },
    availability: {
      type: String,
      enum: ["available", "limited", "sold-out"],
      default: "available",
    },
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    coverImage: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    landArea: { type: String, trim: true },
    projectArea: { type: String, trim: true },
    bedrooms: { type: String, trim: true, maxlength: 60 },
    bathrooms: { type: String, trim: true, maxlength: 60 },
    verandahs: { type: String, trim: true, maxlength: 60 },
    lifts: { type: String, trim: true, maxlength: 60 },
    parking: { type: String, trim: true, maxlength: 60 },
    unitsPerFloor: { type: String, trim: true, maxlength: 60 },
    floors: { type: String, trim: true, maxlength: 60 },
    totalUnits: { type: String, trim: true, maxlength: 60 },
    flatSizes: { type: [String], default: [] },
    facing: { type: String, trim: true },
    handoverDate: { type: Date },
    features: { type: [projectFeatureSchema], default: [] },
    highlights: { type: [projectHighlightSchema], default: [] },
    amenities: { type: projectAmenitiesSchema, default: () => ({}) },
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

// In development, hot reload keeps the previously compiled model in memory, so
// schema edits (e.g. a field changing from Number to String) would be ignored
// until a restart. Recompile it there; production always starts fresh.
if (process.env.NODE_ENV !== "production" && mongoose.models.Project) {
  mongoose.deleteModel("Project");
}

export const ProjectModel =
  (mongoose.models.Project as Model<Project> | undefined) ??
  mongoose.model<Project>("Project", projectSchema);
