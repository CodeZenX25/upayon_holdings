import type {
  ProjectAvailability,
  ProjectCategory,
  ProjectStatus,
  ProjectType,
} from "@/models/project";

export const statusLabel: Record<ProjectStatus, string> = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
};

export const availabilityLabel: Record<ProjectAvailability, string> = {
  available: "Available",
  limited: "Limited units",
  "sold-out": "Sold out",
};

export const categoryLabel: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  "mixed-use": "Mixed-use",
};

export const ownershipLabel: Record<ProjectType, string> = {
  "land-share": "Land share",
  "flat-share": "Flat share",
};

export function formatHandover(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
