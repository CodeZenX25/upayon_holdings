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
  Image as ImageIcon,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";

export interface ProjectData {
  _id?: string;
  title: string;
  slug: string;
  status: "ongoing" | "upcoming" | "completed";
  type: "land-share" | "flat-share";
  location: string;
  address: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  landArea?: string;
  floors?: number;
  totalUnits?: number;
  flatSizes: string[];
  facing?: string;
  handoverDate?: string;
  features: Array<{ name: string; icon: string }>;
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
  location: "",
  address: "",
  shortDescription: "",
  description: "",
  coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  images: [],
  landArea: "",
  floors: 10,
  totalUnits: 20,
  flatSizes: ["1450 sqft"],
  facing: "South-East",
  handoverDate: "",
  features: [
    { name: "24/7 Security", icon: "ShieldCheck" },
    { name: "High Speed Elevator", icon: "ChevronsUp" },
    { name: "Full Generator Backup", icon: "Zap" },
  ],
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
        floors: formData.floors ? Number(formData.floors) : undefined,
        totalUnits: formData.totalUnits ? Number(formData.totalUnits) : undefined,
        progress: Number(formData.progress || 0),
        order: Number(formData.order || 0),
        handoverDate: formData.handoverDate ? new Date(formData.handoverDate) : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
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
      <DialogContent className="max-w-3xl sm:max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-navy-900">
                {isEdit ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription>
                {isEdit
                  ? `Updating details for "${project?.title}"`
                  : "Add a new residential flat share or land share development."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full h-auto p-1 bg-muted/60">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* TAB 1: BASIC INFO */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <div className="flex gap-2">
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

                <div className="grid grid-cols-2 gap-2">
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

                <div className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2 bg-muted/10">
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
                  <Label htmlFor="floors">Total Building Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    min="1"
                    placeholder="e.g. 12"
                    value={formData.floors ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        floors: e.target.value ? parseInt(e.target.value, 10) : undefined,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="totalUnits">Total Residential Units</Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    min="1"
                    placeholder="e.g. 24"
                    value={formData.totalUnits ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        totalUnits: e.target.value ? parseInt(e.target.value, 10) : undefined,
                      }))
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

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="brochureUrl">Brochure PDF Download URL</Label>
                  <Input
                    id="brochureUrl"
                    type="url"
                    placeholder="https://example.com/brochures/project.pdf"
                    value={formData.brochureUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, brochureUrl: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                  <Input
                    id="mapEmbedUrl"
                    type="url"
                    placeholder="https://www.google.com/maps/embed?..."
                    value={formData.mapEmbedUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, mapEmbedUrl: e.target.value }))
                    }
                  />
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Amenities & Features</h4>
                  <p className="text-xs text-muted-foreground">
                    Add standard icons and descriptive names for key building features.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      features: [...prev.features, { name: "New Feature", icon: "Check" }],
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
                    <div className="w-1/3">
                      <Input
                        placeholder="Icon name (e.g. Shield, Zap, Car)"
                        value={feat.icon}
                        onChange={(e) => {
                          const updated = [...formData.features];
                          updated[idx].icon = e.target.value;
                          setFormData((prev) => ({ ...prev, features: updated }));
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Feature name (e.g. 24/7 Security)"
                        value={feat.name}
                        onChange={(e) => {
                          const updated = [...formData.features];
                          updated[idx].name = e.target.value;
                          setFormData((prev) => ({ ...prev, features: updated }));
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

            {/* TAB 4: FLOOR PLANS */}
            <TabsContent value="floorplans" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
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
                        {
                          title: "Type A - 1450 sqft",
                          image:
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                        },
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
                    className="flex flex-col sm:flex-row gap-3 rounded-lg border border-border p-3 bg-card items-start sm:items-center"
                  >
                    <div className="size-16 rounded border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                      {fp.image ? (
                        <img
                          src={fp.image}
                          alt={fp.title}
                          className="size-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      <Input
                        placeholder="Plan title (e.g. 3-Bed Deluxe)"
                        value={fp.title}
                        onChange={(e) => {
                          const updated = [...formData.floorPlans];
                          updated[idx].title = e.target.value;
                          setFormData((prev) => ({ ...prev, floorPlans: updated }));
                        }}
                      />
                      <Input
                        type="url"
                        placeholder="Image URL"
                        value={fp.image}
                        onChange={(e) => {
                          const updated = [...formData.floorPlans];
                          updated[idx].image = e.target.value;
                          setFormData((prev) => ({ ...prev, floorPlans: updated }));
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

              <div className="flex items-center justify-between pt-2">
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
                  setFormData((prev) => ({ ...prev, coverImage: val as string }))
                }
              />

              <div className="border-t border-border pt-4">
                <ImageUploader
                  label="Additional Gallery Photos"
                  description="Exterior, interior, and architectural captures with drag & drop reorder"
                  folder="projects"
                  multiple
                  value={formData.images}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, images: val as string[] }))
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

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <LoaderCircle className="size-4 animate-spin mr-1" />}
              {isEdit ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
