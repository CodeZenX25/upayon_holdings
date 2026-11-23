"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Images,
  UploadCloud,
  GripVertical,
  Trash2,
  Edit2,
  Video,
  LoaderCircle,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GalleryItemData {
  _id: string;
  title: string;
  category: "ongoing" | "completed" | "interior" | "events" | "video";
  imageUrl: string;
  videoUrl?: string;
  project?: {
    _id: string;
    title: string;
  };
  order: number;
}

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "interior", label: "Interior" },
  { id: "events", label: "Events" },
  { id: "video", label: "Videos" },
];

function SortableGalleryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItemData;
  onEdit: (item: GalleryItemData) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative rounded-xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Image Thumbnail */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="size-full object-cover transition-transform group-hover:scale-105 duration-300"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
          className="absolute left-2 top-2 rounded-md bg-black/60 p-1.5 text-white backdrop-blur-xs cursor-grab active:cursor-grabbing hover:bg-black/80 transition-colors"
        >
          <GripVertical className="size-4" />
        </button>

        {/* Category badge */}
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="capitalize text-[10px] bg-black/60 text-white backdrop-blur-xs border-none">
            {item.category}
          </Badge>
        </div>

        {item.videoUrl && (
          <div className="absolute left-2 bottom-2 rounded-md bg-primary/90 px-2 py-0.5 text-white text-[10px] flex items-center gap-1 backdrop-blur-xs">
            <Video className="size-3" />
            Video
          </div>
        )}
      </div>

      {/* Info & Actions */}
      <div className="p-3 flex items-center justify-between gap-2 flex-1">
        <div className="truncate">
          <p className="font-semibold text-xs text-navy-900 truncate" title={item.title}>
            {item.title}
          </p>
          <p className="text-[10px] text-muted-foreground">Order: #{item.order}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onEdit(item)}
            title="Edit item"
          >
            <Edit2 className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onDelete(item._id)}
            title="Delete item"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GalleryView() {
  const [items, setItems] = React.useState<GalleryItemData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  // Dialogs
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<GalleryItemData | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Bulk / single upload form states
  const [activeUploadTab, setActiveUploadTab] = React.useState("single");
  const [singleTitle, setSingleTitle] = React.useState("");
  const [singleCategory, setSingleCategory] = React.useState<GalleryItemData["category"]>("ongoing");
  const [singleImageUrl, setSingleImageUrl] = React.useState("");
  const [singleVideoUrl, setSingleVideoUrl] = React.useState("");
  const [bulkCategory, setBulkCategory] = React.useState<GalleryItemData["category"]>("ongoing");
  const [bulkUrls, setBulkUrls] = React.useState("");
  const [bulkPrefix, setBulkPrefix] = React.useState("Site Showcase");
  const [uploading, setUploading] = React.useState(false);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchGallery = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      const res = await fetch(`/api/admin/gallery${params}`);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Handle Drag Reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setItems(reordered);

    try {
      const payload = {
        items: reordered.map((item, idx) => ({ id: item._id, order: idx })),
      };
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save reorder");
      toast.success("Gallery arrangement saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to persist reorder. Refreshing...");
      fetchGallery();
    }
  };

  // Handle Single Item Save (Create or Edit)
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleImageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }
    if (!singleTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setUploading(true);
      const isEdit = Boolean(editingItem);
      const url = isEdit
        ? `/api/admin/gallery/${editingItem!._id}`
        : "/api/admin/gallery";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        title: singleTitle.trim(),
        category: singleCategory,
        imageUrl: singleImageUrl.trim(),
        videoUrl: singleVideoUrl.trim() || undefined,
        order: editingItem ? editingItem.order : items.length,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Operation failed");
      }

      toast.success(isEdit ? "Gallery item updated!" : "Gallery item added!");
      setUploadDialogOpen(false);
      setEditingItem(null);
      setSingleTitle("");
      setSingleImageUrl("");
      setSingleVideoUrl("");
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setUploading(false);
    }
  };

  // Handle Bulk Upload
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      toast.error("Please enter at least one image URL");
      return;
    }

    try {
      setUploading(true);
      const bulkItems = urls.map((imageUrl, idx) => ({
        title: `${bulkPrefix} ${idx + 1}`,
        category: bulkCategory,
        imageUrl,
        order: items.length + idx,
      }));

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bulkItems }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Bulk upload failed");
      }

      toast.success(`Successfully uploaded ${urls.length} gallery items!`);
      setUploadDialogOpen(false);
      setBulkUrls("");
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/gallery/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete item");
      }
      toast.success("Gallery item deleted");
      setDeleteId(null);
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setSingleTitle(item.title);
    setSingleCategory(item.category);
    setSingleImageUrl(item.imageUrl);
    setSingleVideoUrl(item.videoUrl || "");
    setActiveUploadTab("single");
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Media Gallery
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage photo and video assets. Drag cards using the handle to reorder the presentation.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setSingleTitle("");
            setSingleImageUrl("");
            setSingleVideoUrl("");
            setUploadDialogOpen(true);
          }}
          className="gap-1.5 bg-primary text-white hover:bg-navy-800"
        >
          <UploadCloud className="size-4" />
          <span>Upload Media</span>
        </Button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-primary text-white shadow-xs"
                : "bg-white text-muted-foreground hover:bg-muted hover:text-navy-900 border border-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Card key={i} className="overflow-hidden border-border">
              <Skeleton className="aspect-4/3 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-16 text-center space-y-3">
            <Images className="size-10 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium text-navy-900">No media in this category</p>
            <p className="text-xs text-muted-foreground">
              Add photographs or videos to populate this gallery segment.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setUploadDialogOpen(true);
              }}
            >
              Add First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i._id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <SortableGalleryCard
                  key={item._id}
                  item={item}
                  onEdit={openEditModal}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload / Edit Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={uploading ? () => {} : setUploadDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Gallery Item" : "Upload Media to Gallery"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update caption, category, or media links."
                : "Add individual photos or perform bulk URL imports."}
            </DialogDescription>
          </DialogHeader>

          {!editingItem ? (
            <Tabs value={activeUploadTab} onValueChange={setActiveUploadTab}>
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="single">Single Item</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
              </TabsList>

              {/* Single item mode */}
              <TabsContent value="single">
                <form onSubmit={handleSingleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="singleTitle">Caption / Title *</Label>
                    <Input
                      id="singleTitle"
                      placeholder="e.g. Grand Lobby Elevation"
                      value={singleTitle}
                      onChange={(e) => setSingleTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="singleCategory">Category *</Label>
                    <Select
                      id="singleCategory"
                      value={singleCategory}
                      onChange={(e) =>
                        setSingleCategory(
                          e.target.value as GalleryItemData["category"]
                        )
                      }
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="interior">Interior</option>
                      <option value="events">Events</option>
                      <option value="video">Video</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <ImageUploader
                      label="Media File (Image / Video) *"
                      description="Auto-converts images to WebP and stores in gallery/"
                      folder="gallery"
                      allowVideo
                      value={singleImageUrl}
                      onChange={(val) => setSingleImageUrl(val as string)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="singleVideoUrl">External Video URL (Optional - e.g. YouTube / Vimeo)</Label>
                    <Input
                      id="singleVideoUrl"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={singleVideoUrl}
                      onChange={(e) => setSingleVideoUrl(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUploadDialogOpen(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading && <LoaderCircle className="size-4 animate-spin mr-1" />}
                      Add to Gallery
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>

              {/* Bulk import mode */}
              <TabsContent value="bulk">
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bulkCategory">Category for All Items</Label>
                    <Select
                      id="bulkCategory"
                      value={bulkCategory}
                      onChange={(e) =>
                        setBulkCategory(
                          e.target.value as GalleryItemData["category"]
                        )
                      }
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="interior">Interior</option>
                      <option value="events">Events</option>
                      <option value="video">Video</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bulkPrefix">Title Prefix</Label>
                    <Input
                      id="bulkPrefix"
                      placeholder="e.g. Site Inspection Update"
                      value={bulkPrefix}
                      onChange={(e) => setBulkPrefix(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <ImageUploader
                      label="Upload Multiple Files via Cloudinary"
                      description="Drag & drop or select multiple images/videos (auto-converted to WebP)"
                      folder="gallery"
                      multiple
                      allowVideo
                      onChange={(urls) => {
                        const newUrls = (urls as string[]).join("\n");
                        setBulkUrls((prev) => (prev ? `${prev}\n${newUrls}` : newUrls));
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="bulkUrls">Or Paste External Image URLs (One per line)</Label>
                    <Textarea
                      id="bulkUrls"
                      rows={4}
                      placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                      value={bulkUrls}
                      onChange={(e) => setBulkUrls(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUploadDialogOpen(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading && <LoaderCircle className="size-4 animate-spin mr-1" />}
                      Upload All
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            /* Edit single item mode */
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="singleTitle">Caption / Title *</Label>
                <Input
                  id="singleTitle"
                  value={singleTitle}
                  onChange={(e) => setSingleTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="singleCategory">Category *</Label>
                <Select
                  id="singleCategory"
                  value={singleCategory}
                  onChange={(e) =>
                    setSingleCategory(
                      e.target.value as GalleryItemData["category"]
                    )
                  }
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="interior">Interior</option>
                  <option value="events">Events</option>
                  <option value="video">Video</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <ImageUploader
                  label="Replace Media Asset"
                  description="Upload a new image or video to replace the existing one"
                  folder="gallery"
                  allowVideo
                  value={singleImageUrl}
                  onChange={(val) => setSingleImageUrl(val as string)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="singleVideoUrl">External Video URL (Optional)</Label>
                <Input
                  id="singleVideoUrl"
                  type="url"
                  value={singleVideoUrl}
                  onChange={(e) => setSingleVideoUrl(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading && <LoaderCircle className="size-4 animate-spin mr-1" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Media Asset?"
        description="This image will be permanently removed from the website gallery."
        confirmText="Yes, Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
