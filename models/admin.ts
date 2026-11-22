import bcrypt from "bcryptjs";
import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type AdminRole = "admin" | "editor";

export interface Admin {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

const adminSchema = new Schema<Admin>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor"], default: "editor" },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

export type AdminDocument = HydratedDocument<Admin> & {
  createdAt: Date;
  updatedAt: Date;
};

export const AdminModel =
  (mongoose.models.Admin as Model<Admin> | undefined) ??
  mongoose.model<Admin>("Admin", adminSchema);
