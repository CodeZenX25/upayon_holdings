import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type InquiryType = "land-share" | "flat-share" | "general" | "site-visit";
export type LeadStatus = "new" | "contacted" | "closed";

export interface Lead {
  name: string;
  phone: string;
  email?: string;
  project?: Types.ObjectId;
  inquiryType: InquiryType;
  message: string;
  status: LeadStatus;
  notes: string;
}

const leadSchema = new Schema<Lead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    inquiryType: {
      type: String,
      enum: ["land-share", "flat-share", "general", "site-visit"],
      required: true,
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export type LeadDocument = HydratedDocument<Lead> & {
  createdAt: Date;
  updatedAt: Date;
};

export const LeadModel =
  (mongoose.models.Lead as Model<Lead> | undefined) ??
  mongoose.model<Lead>("Lead", leadSchema);
