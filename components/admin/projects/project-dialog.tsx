"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { BrochureUploader } from "@/components/admin/brochure-uploader";

export interface ProjectData {
  _id?: string;
  title: string;
  slug: string;
  status: "ongoing" | "upcoming" | "completed";
  type: "land-share" | "flat-share";
  category: "residential" | "commercial" | "mixed-use";
  availability: "available" | "limited" | "sold-out";
  location: string;
  address: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  videos: string[];
  landArea?: string;
  projectArea?: string;
  floors?: string;
  totalUnits?: string;
  unitsPerFloor?: string;
  bedrooms?: string;
  bathrooms?: string;
  verandahs?: string;
  lifts?: string;
  parking?: string;
  flatSizes: string[];
  facing?: string;
  handoverDate?: string;
  features: Array<{ name: string; icon: string }>;
  highlights: Array<{ title: string; text: string }>;
  amenities: Record<AmenityGroup, string[]>;
  floorPlans: Array<{ title: string; image: string }>;
  mapEmbedUrl?: string;
  progress: number;
  progressUpdates: Array<{
    date: string;
    note: string;
    images: string[];
  }>;
  brochureUrl?: string;
  isFeatured: boolean;
  order: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

type AmenityGroup = "interior" | "outdoor" | "utilities" | "other" | "nearby";

const amenityGroups: { key: AmenityGroup; label: string; placeholder: string }[] = [
  { key: "interior", label: "Interior features", placeholder: "e.g. False ceiling" },
  { key: "outdoor", label: "Outdoor features", placeholder: "e.g. Rooftop garden" },
  { key: "utilities", label: "Utilities", placeholder: "e.g. Generator backup" },
  { key: "other", label: "Other features", placeholder: "e.g. Wheelchair accessible" },
  { key: "nearby", label: "Nearby", placeholder: "e.g. Hospital" },
];

const projectTabs = [
  { value: "basic", label: "Basic Info" },
  { value: "details", label: "Details" },
  { value: "features", label: "Features" },
  { value: "amenities", label: "Amenities" },
  { value: "floorplans", label: "Floor Plans" },
  { value: "progress", label: "Progress" },
  { value: "images", label: "Images" },
  { value: "seo", label: "SEO" },
] as const;

const emptyAmenities: Record<AmenityGroup, string[]> = {
  interior: [],
  outdoor: [],
  utilities: [],
  other: [],
  nearby: [],
};

type SpecKey =
  | "bedrooms"
  | "bathrooms"
  | "verandahs"
  | "lifts"
  | "parking"
  | "unitsPerFloor"
  | "floors"
  | "totalUnits";

const specKeys: SpecKey[] = [
  "bedrooms",
  "bathrooms",
  "verandahs",
  "lifts",
  "parking",
  "unitsPerFloor",
  "floors",
  "totalUnits",
];

/** Free-text spec fields: numbers, letters or both (e.g. "12", "G+8", "2 covered"). */
const specFields: { key: SpecKey; label: string; placeholder: string }[] = [
  { key: "floors", label: "Total Building Floors", placeholder: "e.g. 12 or G+8" },
  { key: "totalUnits", label: "Total Residential Units", placeholder: "e.g. 24 or 24 flats" },
  { key: "bedrooms", label: "Bedrooms (per unit)", placeholder: "e.g. 3 or 3 + servant room" },
  { key: "bathrooms", label: "Bathrooms (per unit)", placeholder: "e.g. 3 or 2 attached + 1" },
  { key: "verandahs", label: "Verandahs (per unit)", placeholder: "e.g. 2 or 3 (1 drawing)" },
  { key: "unitsPerFloor", label: "Units per floor", placeholder: "e.g. 2 or 2 (A & B)" },
  { key: "lifts", label: "Lifts", placeholder: "e.g. 1 or 2 (8 person)" },
  { key: "parking", label: "Parking spaces", placeholder: "e.g. 12 or 1 per flat" },
];

/** Which tab holds each top-level field — used to jump to a field the server rejected. */
const fieldTab: Record<string, (typeof projectTabs)[number]["value"]> = {
  category: "details",
  availability: "details",
  projectArea: "details",
  landArea: "details",
  facing: "details",
  handoverDate: "details",
  order: "details",
  brochureUrl: "details",
  mapEmbedUrl: "details",
  flatSizes: "details",
  ...Object.fromEntries(specKeys.map((key) => [key, "details" as const])),
  features: "features",
  highlights: "amenities",
  amenities: "amenities",
  floorPlans: "floorplans",
  progress: "progress",
  progressUpdates: "progress",
  coverImage: "images",
  images: "images",
  videos: "images",
  seo: "seo",
};

/** Older projects stored these as numbers — show them as text in the form. */
function specToText(value: unknown): string {
  if (typeof value === "number") return value > 0 ? String(value) : "";
  return typeof value === "string" ? value : "";
}

function ChipListInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = React.useState("");
  const add = () => {
    const value = draft.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add} className="shrink-0">
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((v) => v !== value))}
                className="hover:text-destructive"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectData | null;
  onSuccess: () => void;
}

const defaultProject: ProjectData = {
  title: "",
  slug: "",
  status: "ongoing",
  type: "flat-share",
  category: "residential",
  availability: "available",
  location: "",
  address: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  images: [],
  videos: [],
  landArea: "",
  projectArea: "",
  flatSizes: [],
  facing: "",
  handoverDate: "",
  features: [],
  highlights: [],
  amenities: emptyAmenities,
  floorPlans: [],
  mapEmbedUrl: "",
  progress: 0,
  progressUpdates: [],
  brochureUrl: "",
  isFeatured: false,
  order: 0,
  seo: {
    metaTitle: "",
    metaDescription: "",
  },
};

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectDialogProps) {
  const [formData, setFormData] = React.useState<ProjectData>(defaultProject);
  const [submitting, setSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("basic");
  const [newFlatSize, setNewFlatSize] = React.useState("");

  const isEdit = Boolean(project?._id);

  React.useEffect(() => {
    if (project) {
      setFormData({
        ...defaultProject,
        ...project,
        handoverDate: project.handoverDate
          ? new Date(project.handoverDate).toISOString().split("T")[0]
          : "",
        seo: { ...defaultProject.seo, ...project.seo },
        amenities: { ...emptyAmenities, ...project.amenities },
        videos: project.videos ?? [],
        highlights: project.highlights ?? [],
        ...Object.fromEntries(specKeys.map((key) => [key, specToText(project[key])])),
      });
    } else {
      setFormData(defaultProject);
    }
    setActiveTab("basic");
  }, [project, open]);

  // Helper to auto-generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.location.trim() || !formData.address.trim()) {
      toast.error("Location and address are required");
      setActiveTab("basic");
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error("Short description is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.coverImage.trim()) {
      toast.error("Cover image URL is required");
      setActiveTab("images");
      return;
    }

    try {
      setSubmitting(true);
      const url = isEdit
        ? `/api/admin/projects/${project!._id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        ...Object.fromEntries(
          specKeys.map((key) => [key, formData[key]?.trim() || undefined]),
        ),
        landArea: formData.landArea?.trim() || undefined,
        projectArea: formData.projectArea?.trim() || undefined,
        facing: formData.facing?.trim() || undefined,
        mapEmbedUrl: formData.mapEmbedUrl?.trim() || undefined,
        brochureUrl: formData.brochureUrl?.trim() || undefined,
        features: formData.features
          .map((f) => ({ name: f.name.trim(), icon: f.icon || "check" }))
          .filter((f) => f.name),
        highlights: formData.highlights
          .map((h) => ({ title: h.title.trim(), text: h.text.trim() }))
          .filter((h) => h.title && h.text),
        floorPlans: formData.floorPlans
          .map((p) => ({ title: p.title.trim(), image: p.image.trim() }))
          .filter((p) => p.title && p.image),
        progressUpdates: formData.progressUpdates
          .map((u) => ({ ...u, note: u.note.trim() }))
          .filter((u) => u.note && u.date),
        description: formData.description.trim(),
        progress: Number(formData.progress || 0),
        order: Number(formData.order || 0),
        handoverDate: formData.handoverDate ? new Date(formData.handoverDate) : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData: { message?: string; issues?: { path: string }[] } = await res.json();

      if (!res.ok) {
        // Open the tab that holds the first invalid field
        const field = resData.issues?.[0]?.path.split(".")[0];
        if (field) setActiveTab(fieldTab[field] ?? "basic");
        throw new Error(resData.message || "Failed to save project");
      }

      toast.success(
        isEdit ? "Project updated successfully!" : "Project created successfully!"
      );
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={submitting ? () => { } : onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90dvh]">
        <DialogHeader className="mb-0 p-4 pb-3 pr-12 sm:p-6 sm:pb-4 sm:pr-14 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold text-navy-900">
                {isEdit ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription className="break-words">
                {isEdit
                  ? `Updating details for "${project?.title}"`
                  : "Add a new residential flat share or land share development."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Phones/tablets: one scrollable row. Desktop: all 8 tabs fit. */}
            <TabsList className="flex w-full h-auto p-1 bg-muted/60 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-8 lg:overflow-visible">
              {projectTabs.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="shrink-0 px-3 py-2 lg:px-2">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* TAB 1: BASIC INFO */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <div className="flex flex-col gap-2 min-[420px]:flex-row">
                    <Input
                      id="title"
                      placeholder="e.g. Upayon Green Valley"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSlug}
                      title="Auto generate slug from title"
                      className="shrink-0 text-xs gap-1"
                    >
                      <Sparkles className="size-3.5 text-gold" />
                      Auto Slug
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slug">Slug (URL Identifier) *</Label>
                  <Input
                    id="slug"
                    placeholder="e.g. upayon-green-valley"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      }))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 min-[420px]:gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Project Status</Label>
                    <Select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as ProjectData["status"],
                        }))
                      }
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="type">Property Type</Label>
                    <Select
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as ProjectData["type"],
                        }))
                      }
                    >
                      <option value="flat-share">Flat Share</option>
                      <option value="land-share">Land Share</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">General Location / Area *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Bashundhara R/A, Dhaka"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address">Exact Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g. Plot 42, Block I, Road 7"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="shortDescription">Short Summary (Preview card) *</Label>
                  <Textarea
                    id="shortDescription"
                    rows={2}
                    placeholder="Brief 1-2 sentence description of the property highlights..."
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortDescription: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Comprehensive overview of structural architectural design, lifestyle amenities, and investment appeal..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 sm:col-span-2 bg-muted/10">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Featured Showcase</p>
                    <p className="text-xs text-muted-foreground">
                      Highlight this project in homepage hero and featured carousels.
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: DETAILS */}
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Project Type</Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as ProjectData["category"],
                      }))
                    }
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed-use">Mixed-use</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value as ProjectData["availability"],
                      }))
                    }
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited units</option>
                    <option value="sold-out">Sold out</option>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="projectArea">Project / Unit Area</Label>
                  <Input
                    id="projectArea"
                    placeholder="e.g. 1531 & 1462 sqft"
                    value={formData.projectArea || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, projectArea: e.target.value }))
                    }
                  />
                </div>

                {specFields.map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="text"
                      maxLength={60}
                      placeholder={placeholder}
                      value={formData[key] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({ ...prev, [key]: value }));
                      }}
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <Label htmlFor="landArea">Land Area</Label>
                  <Input
                    id="landArea"
                    placeholder="e.g. 5 Katha / 10 Decimal"
                    value={formData.landArea || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, landArea: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="facing">Facing Direction</Label>
                  <Input
                    id="facing"
                    placeholder="e.g. South Facing / Corner Plot"
                    value={formData.facing || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, facing: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="handoverDate">Estimated Handover Date</Label>
                  <Input
                    id="handoverDate"
                    type="date"
                    value={formData.handoverDate || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, handoverDate: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="order">Display Sort Priority (Order)</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <BrochureUploader
                    label="Project Brochure (PDF)"
                    description="Visitors get a “Download brochure” button on the project page."
                    folder="projects"
                    downloadName={formData.title}
                    value={formData.brochureUrl || ""}
                    onChange={(url) => setFormData((prev) => ({ ...prev, brochureUrl: url }))}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                  <Input
                    id="mapEmbedUrl"
                    type="text"
                    placeholder="https://www.google.com/maps/embed?... (or paste the full <iframe> code)"
                    value={formData.mapEmbedUrl || ""}
                    onChange={(e) => {
                      // Pasting Google's <iframe …> snippet keeps just its src link
                      const raw = e.target.value;
                      const value = raw.match(/src=["']([^"']+)["']/i)?.[1] ?? raw;
                      setFormData((prev) => ({ ...prev, mapEmbedUrl: value }));
                    }}
                  />
                  {formData.mapEmbedUrl && !formData.mapEmbedUrl.includes("/maps/embed") ? (
                    <p className="text-xs font-medium text-amber-700">
                      This is a normal Maps link — Google won&apos;t show it inside the website. In Google
                      Maps open the place → Share → <strong>Embed a map</strong> → Copy HTML, and paste it here.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Google Maps → Share → Embed a map → Copy HTML, then paste it here.
                    </p>
                  )}
                </div>

                {/* Flat sizes chip list */}
                <div className="space-y-2 sm:col-span-2 border-t border-border pt-4">
                  <Label>Available Flat Sizes / Configurations</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. 1450 sqft (Type A)"
                      value={newFlatSize}
                      onChange={(e) => setNewFlatSize(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newFlatSize.trim()) {
                            setFormData((prev) => ({
                              ...prev,
                              flatSizes: [...prev.flatSizes, newFlatSize.trim()],
                            }));
                            setNewFlatSize("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newFlatSize.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            flatSizes: [...prev.flatSizes, newFlatSize.trim()],
                          }));
                          setNewFlatSize("");
                        }
                      }}
                    >
                      Add Size
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.flatSizes.map((size, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                      >
                        <span>{size}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              flatSizes: prev.flatSizes.filter((_, i) => i !== idx),
                            }))
                          }
                          className="hover:text-destructive"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: FEATURES */}
            <TabsContent value="features" className="space-y-4 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Key Features</h4>
                  <p className="text-xs text-muted-foreground">
                    Short bullet points shown in the &quot;Key features&quot; list on the project page.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      features: [...prev.features, { name: "", icon: "check" }],
                    }))
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  Add Feature
                </Button>
              </div>

              <div className="space-y-2">
                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-border p-2.5 bg-card"
                  >
                    <div className="flex-1">
                      <Input
                        placeholder="e.g. Two apartments per floor for privacy"
                        value={feat.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            features: prev.features.map((f, i) =>
                              i === idx ? { ...f, name: value } : f
                            ),
                          }));
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          features: prev.features.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Project Highlights</h4>
                    <p className="text-xs text-muted-foreground">
                      Label and short explanation, e.g. &quot;Prime location&quot; — &quot;Close to schools and hospitals&quot;.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        highlights: [...prev.highlights, { title: "", text: "" }],
                      }))
                    }
                    className="gap-1 text-xs"
                  >
                    <Plus className="size-3.5" />
                    Add Highlight
                  </Button>
                </div>
                {formData.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 rounded-lg border border-border p-2.5 bg-card sm:flex-row sm:items-start"
                  >
                    <Input
                      className="sm:w-1/3"
                      placeholder="Label (e.g. Prime location)"
                      value={item.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          highlights: prev.highlights.map((h, i) =>
                            i === idx ? { ...h, title: value } : h
                          ),
                        }));
                      }}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Short explanation"
                      value={item.text}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          highlights: prev.highlights.map((h, i) =>
                            i === idx ? { ...h, text: value } : h
                          ),
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Remove highlight"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          highlights: prev.highlights.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {amenityGroups.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2 border-t border-border pt-4">
                  <Label>{label}</Label>
                  <ChipListInput
                    values={formData.amenities[key]}
                    placeholder={placeholder}
                    onChange={(values) =>
                      setFormData((prev) => ({
                        ...prev,
                        amenities: { ...prev.amenities, [key]: values },
                      }))
                    }
                  />
                </div>
              ))}
            </TabsContent>

            {/* TAB 4: FLOOR PLANS */}
            <TabsContent value="floorplans" className="space-y-4 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Floor Layouts & Blueprints</h4>
                  <p className="text-xs text-muted-foreground">
                    Attach layout schematics for unit types.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      floorPlans: [
                        ...prev.floorPlans,
                        { title: "", image: "" },
                      ],
                    }))
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  Add Floor Plan
                </Button>
              </div>

              <div className="space-y-3">
                {formData.floorPlans.map((fp, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 rounded-lg border border-border p-3 bg-card items-start"
                  >
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Plan title (e.g. Type A — 1531 sqft)"
                        value={fp.title}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            floorPlans: prev.floorPlans.map((p, i) =>
                              i === idx ? { ...p, title: value } : p
                            ),
                          }));
                        }}
                      />
                      <ImageUploader
                        folder="projects"
                        value={fp.image}
                        onChange={(val) => {
                          const image = Array.isArray(val) ? val[0] ?? "" : val;
                          setFormData((prev) => ({
                            ...prev,
                            floorPlans: prev.floorPlans.map((p, i) =>
                              i === idx ? { ...p, image } : p
                            ),
                          }));
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          floorPlans: prev.floorPlans.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 5: PROGRESS UPDATES */}
            <TabsContent value="progress" className="space-y-4 pt-4">
              <div className="space-y-2 rounded-lg border border-border p-4 bg-muted/10">
                <div className="flex justify-between items-center">
                  <Label htmlFor="progress">Overall Construction Progress</Label>
                  <span className="text-base font-bold text-navy-900">
                    {formData.progress}%
                  </span>
                </div>
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      progress: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-primary h-2 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Milestone Updates Log</h4>
                  <p className="text-xs text-muted-foreground">
                    Chronological progress timeline shown to share owners and prospective buyers.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      progressUpdates: [
                        {
                          date: new Date().toISOString().split("T")[0],
                          note: "Piling and foundation completed.",
                          images: [],
                        },
                        ...prev.progressUpdates,
                      ],
                    }))
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  Add Update
                </Button>
              </div>

              <div className="space-y-3">
                {formData.progressUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 rounded-lg border border-border p-3.5 bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        type="date"
                        className="w-40 h-7 text-xs"
                        value={
                          update.date
                            ? new Date(update.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...formData.progressUpdates];
                          updated[idx].date = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            progressUpdates: updated,
                          }));
                        }}
                      />
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            progressUpdates: prev.progressUpdates.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                        className="text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="Note details about structural stage, slab casting, brickwork..."
                      value={update.note}
                      onChange={(e) => {
                        const updated = [...formData.progressUpdates];
                        updated[idx].note = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          progressUpdates: updated,
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 6: IMAGES */}
            <TabsContent value="images" className="space-y-6 pt-4">
              <ImageUploader
                label="Primary Cover / Hero Image *"
                description="Main visual for project cards and detail headers (Auto-converted to WebP, stored in projects/)"
                folder="projects"
                value={formData.coverImage}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: Array.isArray(val) ? val[0] ?? "" : val,
                  }))
                }
              />

              <div className="border-t border-border pt-4">
                <ImageUploader
                  label="Gallery Photos"
                  description="Shown in the Gallery section of the project page. Upload exterior, interior and site photos; drag to reorder."
                  folder="projects"
                  multiple
                  value={formData.images}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      images: Array.isArray(val) ? val : [val].filter(Boolean),
                    }))
                  }
                />
              </div>

              <div className="border-t border-border pt-4">
                <ImageUploader
                  label="Project Videos"
                  description="Walkthroughs or drone footage (MP4/WebM), uploaded to Cloudinary"
                  folder="projects"
                  multiple
                  allowVideo
                  maxFiles={10}
                  value={formData.videos}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      videos: Array.isArray(val) ? val : [val].filter(Boolean),
                    }))
                  }
                />
              </div>
            </TabsContent>

            {/* TAB 7: SEO */}
            <TabsContent value="seo" className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="metaTitle">SEO Meta Title</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.seo?.metaTitle?.length || 0} / 70
                  </span>
                </div>
                <Input
                  id="metaTitle"
                  maxLength={70}
                  placeholder="e.g. Upayon Green Valley | Premium Flats in Bashundhara"
                  value={formData.seo?.metaTitle || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, metaTitle: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="metaDescription">SEO Meta Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {formData.seo?.metaDescription?.length || 0} / 320
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  maxLength={320}
                  rows={3}
                  placeholder="Search engine summary highlighting location, flat share benefits, and handover schedule..."
                  value={formData.seo?.metaDescription || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, metaDescription: e.target.value },
                    }))
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
          </div>

          {/* Footer stays visible below the scrolling fields */}
          <DialogFooter className="mt-0 border-t border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting && <LoaderCircle className="size-4 animate-spin mr-1" />}
              {isEdit ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
