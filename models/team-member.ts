import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

/** "leadership" = large cards at the top (Chairman, MD…); "department" = department heads grid. */
export type TeamGroup = "leadership" | "department";

export interface TeamMember {
  name: string;
  designation: string;
  photo?: string;
  group: TeamGroup;
  order: number;
  isActive: boolean;
}

const teamMemberSchema = new Schema<TeamMember>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    group: { type: String, enum: ["leadership", "department"], default: "department", index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type TeamMemberDocument = HydratedDocument<TeamMember> & { createdAt: Date; updatedAt: Date };

// Recompile on hot reload in development so schema edits take effect without a restart.
if (process.env.NODE_ENV !== "production" && mongoose.models.TeamMember) {
  mongoose.deleteModel("TeamMember");
}

export const TeamMemberModel =
  (mongoose.models.TeamMember as Model<TeamMember> | undefined) ??
  mongoose.model<TeamMember>("TeamMember", teamMemberSchema);
