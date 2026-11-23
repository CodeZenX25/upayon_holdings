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
import { Switch } from "@/components/ui/switch";
import { Sparkles, LoaderCircle } from "lucide-react";
import { TiptapEditor } from "./tiptap-editor";
import { ImageUploader } from "@/components/admin/image-uploader";

export interface BlogData {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: BlogData | null;
  onSuccess: () => void;
}

const defaultBlog: BlogData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p>Write your article content here...</p>",
  coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  category: "Investment Guide",
  tags: ["Dhaka Real Estate", "Land Share"],
  author: "Upayon Editorial",
  isPublished: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
  },
};

export function BlogDialog({
  open,
  onOpenChange,
  blog,
  onSuccess,
}: BlogDialogProps) {
  const [formData, setFormData] = React.useState<BlogData>(defaultBlog);
  const [submitting, setSubmitting] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");

  const isEdit = Boolean(blog?._id);

  React.useEffect(() => {
    if (blog) {
      setFormData({
        ...defaultBlog,
        ...blog,
        seo: { ...defaultBlog.seo, ...blog.seo },
      });
    } else {
      setFormData(defaultBlog);
    }
  }, [blog, open]);

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error("Excerpt summary is required");
      return;
    }
    if (!formData.content.trim() || formData.content === "<p></p>") {
      toast.error("Content is required");
      return;
    }
    if (!formData.coverImage.trim()) {
      toast.error("Cover image URL is required");
      return;
    }

    try {
      setSubmitting(true);
      const url = isEdit
        ? `/api/admin/blogs/${blog!._id}`
        : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to save blog post");
      }

      toast.success(
        isEdit ? "Article updated successfully!" : "Article created successfully!"
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
    <Dialog open={open} onOpenChange={submitting ? () => {} : onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-3 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-navy-900">
                {isEdit ? "Edit Article" : "Write New Article"}
              </DialogTitle>
              <DialogDescription>
                Publish market insights, guides, and construction developments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title & Slug */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="blogTitle">Article Title *</Label>
              <div className="flex gap-2">
                <Input
                  id="blogTitle"
                  placeholder="e.g. Why Land Share in Dhaka is Outperforming Traditional Flats"
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
                  className="shrink-0 text-xs gap-1"
                >
                  <Sparkles className="size-3.5 text-gold" />
                  Auto Slug
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="blogSlug">Slug (URL) *</Label>
              <Input
                id="blogSlug"
                placeholder="e.g. why-land-share-in-dhaka-is-outperforming"
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

            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g. Investment Guide, Market Update"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                placeholder="e.g. Upayon Research Team"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                required
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="excerpt">Excerpt Summary (Card preview) *</Label>
              <Textarea
                id="excerpt"
                rows={2}
                placeholder="Short summary displayed on blog listings and search results..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                required
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5 sm:col-span-2">
              <ImageUploader
                label="Article Cover Visual *"
                description="High resolution header visual for article header and preview cards (Auto-converted to WebP, stored in blog/)"
                folder="blog"
                value={formData.coverImage}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, coverImage: val as string }))
                }
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2 bg-muted/10">
              <div>
                <p className="text-sm font-semibold text-navy-900">Publish Article</p>
                <p className="text-xs text-muted-foreground">
                  Toggle whether this post is live on the public website or saved as a draft.
                </p>
              </div>
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublished: checked }))
                }
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Article Content (Rich Text) *</Label>
              <TiptapEditor
                value={formData.content}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, content: html }))
                }
              />
            </div>

            {/* Tags */}
            <div className="space-y-2 sm:col-span-2 border-t border-border pt-4">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Dhaka Real Estate, Investment"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== idx),
                        }))
                      }
                      className="hover:text-destructive"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-3 sm:col-span-2 border-t border-border pt-4">
              <h4 className="text-sm font-bold text-navy-900">SEO Settings</h4>
              <div className="space-y-1.5">
                <Label htmlFor="metaTitle">SEO Meta Title</Label>
                <Input
                  id="metaTitle"
                  maxLength={70}
                  value={formData.seo?.metaTitle || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, metaTitle: e.target.value },
                    }))
                  }
                  placeholder="e.g. Real Estate Guide Dhaka | Upayon Holdings"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="metaDescription">SEO Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  maxLength={320}
                  rows={2}
                  value={formData.seo?.metaDescription || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, metaDescription: e.target.value },
                    }))
                  }
                  placeholder="Search engine summary..."
                />
              </div>
            </div>
          </div>

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
              {isEdit ? "Update Article" : "Save Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
