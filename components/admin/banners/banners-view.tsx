"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  LoaderCircle,
  Film,
  ChevronUp,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "@/components/admin/image-uploader";

interface BannerData {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  videoUrl?: string;
  mediaType: "image" | "video";
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  backgroundColor?: string;
  textColor?: string;
}

const defaultBanner: BannerData = {
  title: "Welcome to Upayon Holdings",
  subtitle: "Discover premium real estate opportunities",
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  mediaType: "image",
  buttonText: "Explore",
  buttonUrl: "/projects",
  isActive: true,
  order: 0,
  backgroundColor: "#000000",
  textColor: "#ffffff",
};

export function BannersView() {
  const [banners, setBanners] = React.useState<BannerData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const fetchBanners = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/banners");
      if (!res.ok) throw new Error("Failed to load banners");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load banners");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleAddBanner = () => {
    const newBanner: BannerData = {
      ...defaultBanner,
      order: banners.length,
    };
    setBanners([...banners, newBanner]);
    setEditingId(`new-${Date.now()}`);
  };

  const handleUpdateBanner = (index: number, updatedBanner: BannerData) => {
    const newBanners = [...banners];
    newBanners[index] = updatedBanner;
    setBanners(newBanners);
  };

  const handleRemoveBanner = async (index: number) => {
    const banner = banners[index];
    if (banner._id) {
      try {
        const res = await fetch(`/api/admin/banners/${banner._id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete banner");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete banner from database");
        return;
      }
    }

    const newBanners = banners.filter((_, i) => i !== index);
    setBanners(newBanners);
    toast.success("Banner removed");
  };

  const handleMoveBanner = (index: number, direction: "up" | "down") => {
    const newBanners = [...banners];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBanners.length) return;

    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    newBanners.forEach((banner, idx) => {
      banner.order = idx;
    });

    setBanners(newBanners);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const bannersToSave = banners.map((banner) => {
        const { _id, ...rest } = banner;
        return _id ? { _id, ...rest } : rest;
      });

      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannersToSave),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update banners");
      }

      const updatedBanners = await res.json();
      setBanners(updatedBanners);
      setEditingId(null);
      toast.success("Banners updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save banners");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Banner Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create and manage dynamic banners with images, videos, and call-to-action buttons.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddBanner}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            <span>Add Banner</span>
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="gap-1.5 bg-primary text-white hover:bg-navy-800"
          >
            {saving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Save All</span>
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="p-6">
          {banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Film className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-navy-900">No banners yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Create your first banner to get started
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBanner}
              >
                <Plus className="size-3.5 mr-1" />
                Create Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner, idx) => (
                <BannerCard
                  key={idx}
                  banner={banner}
                  index={idx}
                  isEditing={editingId === banner._id || (banner._id === undefined && editingId === `new-${banner.order}`)}
                  onUpdate={(updated) => handleUpdateBanner(idx, updated)}
                  onRemove={() => handleRemoveBanner(idx)}
                  onMoveUp={() => handleMoveBanner(idx, "up")}
                  onMoveDown={() => handleMoveBanner(idx, "down")}
                  onToggleEdit={() =>
                    setEditingId(
                      editingId === banner._id ? null : banner._id || `new-${banner.order}`
                    )
                  }
                  canMoveUp={idx > 0}
                  canMoveDown={idx < banners.length - 1}
                  total={banners.length}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

interface BannerCardProps {
  banner: BannerData;
  index: number;
  isEditing: boolean;
  onUpdate: (banner: BannerData) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleEdit: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  total: number;
}

function BannerCard({
  banner,
  index,
  isEditing,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onToggleEdit,
  canMoveUp,
  canMoveDown,
}: BannerCardProps) {
  return (
    <div className="rounded-lg border border-border p-4 bg-card space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-navy-900 bg-muted px-2 py-1 rounded">
            #{index + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={banner.isActive}
              onChange={(e) =>
                onUpdate({ ...banner, isActive: e.target.checked })
              }
              className="size-4 rounded border-border cursor-pointer"
              title="Active/Inactive"
            />
            <span className="text-xs text-muted-foreground">
              {banner.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {canMoveUp && (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={onMoveUp}
              title="Move up"
            >
              <ChevronUp className="size-4" />
            </Button>
          )}
          {canMoveDown && (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              onClick={onMoveDown}
              title="Move down"
            >
              <ChevronDown className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={onToggleEdit}
            className="text-primary hover:bg-primary/10"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isEditing ? (
        <BannerPreview banner={banner} />
      ) : (
        <BannerEditor banner={banner} onUpdate={onUpdate} />
      )}
    </div>
  );
}

function BannerPreview({ banner }: { banner: BannerData }) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-navy-900">{banner.title}</h4>
        {banner.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {banner.subtitle}
          </p>
        )}
      </div>

      {banner.image && (
        <div className="h-32 w-full rounded-md border border-border overflow-hidden bg-black/5 relative">
          {banner.mediaType === "video" ||
          banner.image.endsWith(".mp4") ||
          banner.image.endsWith(".webm") ||
          banner.image.includes("/video/upload/") ? (
            <div className="relative size-full">
              <video
                src={banner.image}
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
                <Film className="size-3" /> Video
              </span>
            </div>
          ) : (
            <img
              src={banner.image}
              alt={banner.title}
              className="size-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        {banner.buttonText && (
          <div className="bg-muted/50 rounded p-2">
            <p className="text-muted-foreground">Button</p>
            <p className="font-mono">{banner.buttonText}</p>
          </div>
        )}
        <div className="bg-muted/50 rounded p-2">
          <p className="text-muted-foreground">Type</p>
          <p className="font-mono capitalize">{banner.mediaType}</p>
        </div>
      </div>
    </div>
  );
}

function BannerEditor({
  banner,
  onUpdate,
}: {
  banner: BannerData;
  onUpdate: (banner: BannerData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Banner Title</Label>
          <Input
            value={banner.title}
            onChange={(e) =>
              onUpdate({ ...banner, title: e.target.value })
            }
            placeholder="Enter banner title"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Subtitle (Optional)</Label>
          <Textarea
            rows={2}
            value={banner.subtitle || ""}
            onChange={(e) =>
              onUpdate({ ...banner, subtitle: e.target.value })
            }
            placeholder="Enter banner subtitle"
          />
        </div>

        <div className="space-y-1">
          <Label>Media Type</Label>
          <Select
            value={banner.mediaType}
            onChange={(e) =>
              onUpdate({
                ...banner,
                mediaType: e.target.value as "image" | "video",
              })
            }
          >
            <option value="image">Image Background</option>
            <option value="video">Video Background</option>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Button Text (Optional)</Label>
          <Input
            value={banner.buttonText || ""}
            onChange={(e) =>
              onUpdate({ ...banner, buttonText: e.target.value })
            }
            placeholder="e.g. Explore Projects"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label>Button URL (Optional)</Label>
          <Input
            value={banner.buttonUrl || ""}
            onChange={(e) =>
              onUpdate({ ...banner, buttonUrl: e.target.value })
            }
            placeholder="e.g. /projects or /contact"
          />
        </div>

        <div className="space-y-1">
          <Label>Background Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={banner.backgroundColor || "#000000"}
              onChange={(e) =>
                onUpdate({ ...banner, backgroundColor: e.target.value })
              }
              className="size-10 rounded border border-border cursor-pointer"
            />
            <Input
              value={banner.backgroundColor || "#000000"}
              onChange={(e) =>
                onUpdate({ ...banner, backgroundColor: e.target.value })
              }
              placeholder="#000000"
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Text Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={banner.textColor || "#ffffff"}
              onChange={(e) =>
                onUpdate({ ...banner, textColor: e.target.value })
              }
              className="size-10 rounded border border-border cursor-pointer"
            />
            <Input
              value={banner.textColor || "#ffffff"}
              onChange={(e) =>
                onUpdate({ ...banner, textColor: e.target.value })
              }
              placeholder="#ffffff"
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2 pt-2">
          <ImageUploader
            label="Banner Media (Image or Video)"
            description="Upload high-res image or MP4/WebM video to Cloudinary"
            folder="banners"
            allowVideo
            value={banner.image}
            onChange={(url) => {
              const mediaUrl = url as string;
              const isVid =
                mediaUrl.endsWith(".mp4") ||
                mediaUrl.endsWith(".webm") ||
                mediaUrl.includes("/video/upload/");
              onUpdate({
                ...banner,
                image: mediaUrl,
                mediaType: isVid ? "video" : "image",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
