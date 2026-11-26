"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  MessageSquareQuote,
  Plus,
  Star,
  Edit2,
  Trash2,
  LoaderCircle,
  Building,
  Play,
  Video,
  X,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { parseVideo, youtubeId } from "@/lib/video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export interface TestimonialData {
  _id?: string;
  name?: string;
  photo?: string;
  projectName?: string;
  message?: string;
  rating: number;
  videoUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

/** Set to true to let admins add video testimonials (YouTube link or upload) again. */
const VIDEO_TESTIMONIALS_ENABLED = false;

/** Video testimonial: paste a YouTube link or upload a video file to Cloudinary. */
function VideoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [mode, setMode] = React.useState<"youtube" | "upload">(
    value && !youtubeId(value) ? "upload" : "youtube",
  );
  const parsed = parseVideo(value);
  const showYoutubeError = mode === "youtube" && value.trim() !== "" && !youtubeId(value);

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
            <Video className="size-4 text-brand-purple" />
            Video testimonial (optional)
          </p>
          <p className="text-xs text-muted-foreground">Shown on its own on the website, with a play button.</p>
        </div>
        <div className="inline-flex rounded-md bg-muted p-0.5 text-xs font-semibold">
          {(["youtube", "upload"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded px-3 py-1.5 transition-colors ${
                mode === m ? "bg-background text-navy-900 shadow-xs" : "text-muted-foreground hover:text-navy-900"
              }`}
            >
              {m === "youtube" ? "YouTube link" : "Upload video"}
            </button>
          ))}
        </div>
      </div>

      {mode === "youtube" ? (
        <div className="space-y-1.5">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
            value={value.includes("res.cloudinary.com") ? "" : value}
            onChange={(e) => onChange(e.target.value.trim())}
          />
          {showYoutubeError && (
            <p className="text-xs font-medium text-destructive">
              That isn&apos;t a YouTube video link. Copy the link from YouTube → Share.
            </p>
          )}
        </div>
      ) : (
        <ImageUploader
          folder="testimonials"
          allowVideo
          description="MP4 / WebM, max 50MB"
          value={value.includes("res.cloudinary.com") ? value : ""}
          onChange={(val) => onChange(Array.isArray(val) ? val[0] ?? "" : val)}
        />
      )}

      {parsed && (
        <div className="flex items-center gap-3 rounded-md bg-muted/40 p-2">
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-navy-950">
            {parsed.thumbnail && (
              <img src={parsed.thumbnail} alt="" className="size-full object-cover" />
            )}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-7 place-items-center rounded-full bg-white/90 text-brand-purple">
                <Play className="ml-0.5 size-3.5 fill-current" />
              </span>
            </span>
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-semibold text-navy-900">
              {parsed.kind === "youtube" ? "YouTube video" : "Uploaded video"} ready
            </p>
            <a
              href={parsed.kind === "youtube" ? `https://www.youtube.com/watch?v=${parsed.id}` : parsed.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Preview
            </a>
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={() => onChange("")}
            className="text-destructive hover:bg-destructive/10"
            title="Remove video"
            aria-label="Remove video"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

const defaultTestimonial: TestimonialData = {
  name: "",
  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  projectName: "Gulshan Residences",
  message: "Investing in land shares with Upayon has been a completely transparent and hassle-free experience.",
  rating: 5,
  isActive: true,
};

export function TestimonialsView() {
  const [testimonials, setTestimonials] = React.useState<TestimonialData[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TestimonialData | null>(null);
  const [formData, setFormData] = React.useState<TestimonialData>(defaultTestimonial);
  const [submitting, setSubmitting] = React.useState(false);

  // Delete state
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchTestimonials = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed to load testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData(defaultTestimonial);
    setDialogOpen(true);
  };

  const openEditDialog = (item: TestimonialData) => {
    setEditingItem(item);
    setFormData({
      ...item,
      name: item.name ?? "",
      projectName: item.projectName ?? "",
      message: item.message ?? "",
      rating: item.rating ?? 5,
    });
    setDialogOpen(true);
  };

  const hasVideo = Boolean(formData.videoUrl?.trim());
  const req = hasVideo ? "(optional)" : "*";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Video testimonials only need the video; written ones need name, project and quote.
    if (!formData.videoUrl?.trim()) {
      if (!formData.name?.trim()) {
        toast.error("Client name is required (or add a video)");
        return;
      }
      if (!formData.projectName?.trim()) {
        toast.error("Project name is required (or add a video)");
        return;
      }
      if (!formData.message?.trim()) {
        toast.error("Testimonial quote is required (or add a video)");
        return;
      }
    }

    try {
      setSubmitting(true);
      const isEdit = Boolean(editingItem?._id);
      const url = isEdit
        ? `/api/admin/testimonials/${editingItem!._id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(isEdit ? "Testimonial updated!" : "Testimonial added!");
      setDialogOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete testimonial");
      }
      toast.success("Testimonial removed");
      setDeleteId(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete testimonial");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (item: TestimonialData) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(
        item.isActive
          ? "Testimonial marked inactive"
          : "Testimonial published active"
      );
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage feedback and star ratings from verified landowners and flat owners.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="gap-1.5 bg-primary text-white hover:bg-navy-800"
        >
          <Plus className="size-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {/* Testimonials Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-6 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {testimonials.length} Testimonials on record
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <MessageSquareQuote className="size-10 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium text-navy-900">No testimonials yet</p>
              <p className="text-xs text-muted-foreground">
                Add reviews from satisfied partners and share buyers.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="max-w-md">Feedback Quote</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                          {t.photo ? (
                            <img
                              src={t.photo}
                              alt={t.name ?? ""}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center font-bold text-xs text-primary bg-navy-50">
                              {t.name ? t.name.charAt(0) : <Video className="size-4" />}
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-xs text-navy-900 whitespace-nowrap">
                          {t.name || "Video testimonial"}
                        </span>
                        {t.videoUrl && (
                          <span
                            className="inline-flex items-center gap-1 rounded bg-brand-purple/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-purple"
                            title="Has a video testimonial"
                          >
                            <Video className="size-3" />
                            Video
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-navy-900">
                        <Building className="size-3 text-muted-foreground" />
                        {t.projectName || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-3.5 ${
                              star <= t.rating
                                ? "fill-gold text-gold"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {t.message ? (
                        <p className="line-clamp-2 italic leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                      ) : (
                        <p className="text-muted-foreground">Video only</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(t)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        {t.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => openEditDialog(t)}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setDeleteId(t._id!)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={submitting ? () => {} : setDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Testimonial" : "Add Client Testimonial"}
            </DialogTitle>
            <DialogDescription>
              Record client remarks, photo avatar, and property attribution.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video testimonials are switched off for now; an existing video still shows so it can be removed. */}
            {(VIDEO_TESTIMONIALS_ENABLED || hasVideo) && (
              <VideoField
                value={formData.videoUrl ?? ""}
                onChange={(url) => setFormData((prev) => ({ ...prev, videoUrl: url }))}
              />
            )}

            {hasVideo && (
              <p className="rounded-md bg-brand-purple/10 px-3 py-2 text-xs font-medium text-brand-purple">
                Only the video is shown on the website. The details below are optional — for your records.
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="tName">Client Full Name {req}</Label>
              <Input
                id="tName"
                placeholder="e.g. Engr. Tanvir Ahmed"
                value={formData.name ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required={!hasVideo}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tProject">Property Project Attributed {req}</Label>
              <Input
                id="tProject"
                placeholder="e.g. Upayon Green Valley, Bashundhara"
                value={formData.projectName ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
                required={!hasVideo}
              />
            </div>

            <div className="space-y-1.5">
              <ImageUploader
                label="Client Avatar Photo (Optional)"
                description="Photo of verified homeowner or share investor (Auto-converted to WebP, stored in testimonials/)"
                folder="testimonials"
                value={formData.photo || ""}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, photo: val as string }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tRating">Star Rating (1 - 5) *</Label>
              <Select
                id="tRating"
                value={formData.rating.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: parseInt(e.target.value, 10),
                  }))
                }
              >
                <option value="5">5 Stars - Exceptional</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tMessage">Testimonial Quote {req}</Label>
              <Textarea
                id="tMessage"
                rows={3}
                placeholder="Client comments about transparency, construction pace, share model..."
                value={formData.message ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                required={!hasVideo}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/10">
              <div>
                <p className="text-sm font-semibold text-navy-900">Active Display</p>
                <p className="text-xs text-muted-foreground">
                  Show on homepage and public testimonials carousel.
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <LoaderCircle className="size-4 animate-spin mr-1" />}
                {editingItem ? "Update Review" : "Save Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Testimonial?"
        description="This review will be permanently removed from the website."
        confirmText="Yes, Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
