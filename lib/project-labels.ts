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

/**
 * Label for a spec value that may be a plain number or free text.
 * "3" → "3 Beds"; "G+8" or "3 (master + 2)" → shown as written.
 */
export function specLabel(value: string, unit: string): string {
  return /^\d+(\.\d+)?$/.test(value) ? `${value} ${unit}` : value;
}

export function formatHandover(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
