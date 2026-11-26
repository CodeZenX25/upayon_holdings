import "server-only";
import { connectToDatabase } from "@/lib/db";
import { TeamMemberModel, type TeamGroup, type TeamMember } from "@/models";

export interface TeamMemberView {
  id: string;
  name: string;
  designation: string;
  photo?: string;
  group: TeamGroup;
}

/**
 * DEMO placeholders — shown on the About page ONLY until the first real member
 * is added in Admin → Team. Names are deliberately generic and there are no
 * photos (initials are shown), so no real face is paired with a made-up name.
 */
const demoTeam: TeamMemberView[] = [
  { id: "demo-1", name: "Chairman Name", designation: "Chairman", group: "leadership" },
  { id: "demo-2", name: "Managing Director Name", designation: "Managing Director & CEO", group: "leadership" },
  { id: "demo-3", name: "Director Name", designation: "Director, Operations", group: "department" },
  { id: "demo-4", name: "Engineer Name", designation: "Head of Engineering", group: "department" },
  { id: "demo-5", name: "Architect Name", designation: "Head of Design & Architecture", group: "department" },
  { id: "demo-6", name: "Manager Name", designation: "Head of Sales & Marketing", group: "department" },
];

type TeamLean = TeamMember & { _id: { toString(): string } };

export async function getTeam(): Promise<{ members: TeamMemberView[]; isDemo: boolean }> {
  try {
    await connectToDatabase();
    const docs = await TeamMemberModel.find({ isActive: true })
      .sort({ group: -1, order: 1, createdAt: 1 }) // "leadership" before "department"
      .lean<TeamLean[]>();
    if (docs.length === 0) return { members: demoTeam, isDemo: true };
    return {
      isDemo: false,
      members: docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        designation: doc.designation,
        photo: doc.photo || undefined,
        group: doc.group ?? "department",
      })),
    };
  } catch (error) {
    console.error("Failed to load team:", error);
    return { members: demoTeam, isDemo: true };
  }
}
