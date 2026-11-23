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
} from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
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
  name: string;
  photo?: string;
  projectName: string;
  message: string;
  rating: number;
  isActive: boolean;
  createdAt?: string;
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
    setFormData(item);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!formData.projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Testimonial review message is required");
      return;
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
                              alt={t.name}
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center font-bold text-xs text-primary bg-navy-50">
                              {t.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-xs text-navy-900 whitespace-nowrap">
                          {t.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-navy-900">
                        <Building className="size-3 text-muted-foreground" />
                        {t.projectName}
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
                      <p className="line-clamp-2 italic leading-relaxed">
                        &ldquo;{t.message}&rdquo;
                      </p>
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
            <div className="space-y-1.5">
              <Label htmlFor="tName">Client Full Name *</Label>
              <Input
                id="tName"
                placeholder="e.g. Engr. Tanvir Ahmed"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tProject">Property Project Attributed *</Label>
              <Input
                id="tProject"
                placeholder="e.g. Upayon Green Valley, Bashundhara"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectName: e.target.value,
                  }))
                }
                required
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
              <Label htmlFor="tMessage">Testimonial Quote *</Label>
              <Textarea
                id="tMessage"
                rows={3}
                placeholder="Client comments about transparency, construction pace, share model..."
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                required
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
