import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteStats {
  years: number;
  completed: number;
  ongoing: number;
  families: number;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  order: number;
}

export interface SiteSettings {
  singletonKey: "default";
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  socialLinks: SocialLink[];
  stats: SiteStats;
  heroSlides: HeroSlide[];
}

const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const siteStatsSchema = new Schema<SiteStats>(
  {
    years: { type: Number, min: 0, default: 0, validate: Number.isInteger },
    completed: { type: Number, min: 0, default: 0, validate: Number.isInteger },
    ongoing: { type: Number, min: 0, default: 0, validate: Number.isInteger },
    families: { type: Number, min: 0, default: 0, validate: Number.isInteger },
  },
  { _id: false },
);

const heroSlideSchema = new Schema<HeroSlide>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    buttonText: { type: String, trim: true },
    buttonUrl: { type: String, trim: true },
    order: { type: Number, default: 0, validate: Number.isInteger },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema<SiteSettings>(
  {
    singletonKey: {
      type: String,
      enum: ["default"],
      default: "default",
      unique: true,
      required: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    socialLinks: { type: [socialLinkSchema], default: [] },
    stats: { type: siteStatsSchema, default: () => ({}) },
    heroSlides: { type: [heroSlideSchema], default: [] },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = HydratedDocument<SiteSettings> & {
  createdAt: Date;
  updatedAt: Date;
};

export const SiteSettingsModel =
  (mongoose.models.SiteSettings as Model<SiteSettings> | undefined) ??
  mongoose.model<SiteSettings>("SiteSettings", siteSettingsSchema);
