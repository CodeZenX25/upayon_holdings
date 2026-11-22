import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Blog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt?: Date;
  seo: BlogSeo;
}

const blogSeoSchema = new Schema<BlogSeo>(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { _id: false },
);

const blogSchema = new Schema<Blog>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, required: true, trim: true },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    seo: { type: blogSeoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

blogSchema.index({ slug: 1 }, { unique: true });

export type BlogDocument = HydratedDocument<Blog> & {
  createdAt: Date;
  updatedAt: Date;
};

export const BlogModel =
  (mongoose.models.Blog as Model<Blog> | undefined) ??
  mongoose.model<Blog>("Blog", blogSchema);
