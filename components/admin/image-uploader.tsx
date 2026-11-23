"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  X,
  LoaderCircle,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ImageUploaderFolder = "projects" | "gallery" | "blog" | "testimonials";

interface ImageUploaderProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  folder: ImageUploaderFolder;
  multiple?: boolean;
  maxFiles?: number;
  allowVideo?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function ImageUploader({
  value,
  onChange,
  folder,
  multiple = false,
  maxFiles = 20,
  allowVideo = false,
  className,
  label,
  description,
}: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualInput, setManualInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Normalize value to array of strings
  const items: string[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value].filter(Boolean);
  }, [value]);

  const acceptedTypesString = allowVideo
    ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
    : "image/jpeg,image/png,image/webp";

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Validate and upload files
  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      files = [files[0]];
    }

    if (multiple && items.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    // Validation
    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `"${file.name}" exceeds 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max 5MB allowed.`
        );
        continue;
      }

      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase());
      const isVideo = allowVideo && ALLOWED_VIDEO_TYPES.includes(file.type.toLowerCase());

      if (!isImage && !isVideo) {
        toast.error(
          `"${file.name}" is not supported. Use JPG, PNG, or WEBP${
            allowVideo ? " (or MP4/WebM)" : ""
          }.`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("folder", folder);

      validFiles.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload to Cloudinary");
      }

      const uploadedUrls: string[] = data.urls || (data.url ? [data.url] : []);

      if (uploadedUrls.length === 0) {
        throw new Error("No URL returned from server");
      }

      toast.success(
        `Uploaded ${uploadedUrls.length} file(s) to Cloudinary (auto-converted to WebP)!`
      );

      if (multiple) {
        onChange([...items, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove single image and delete from Cloudinary
  const handleRemove = async (urlToRemove: string, indexToRemove: number) => {
    // 1. Update UI state immediately
    if (multiple) {
      const next = items.filter((_, idx) => idx !== indexToRemove);
      onChange(next);
    } else {
      onChange("");
    }

    // 2. Call Cloudinary delete API in background if it's a Cloudinary URL
    if (urlToRemove.includes("res.cloudinary.com")) {
      try {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToRemove }),
        });
        if (res.ok) {
          toast.success("Image removed and deleted from Cloudinary");
        }
      } catch (err) {
        console.error("Failed to delete from Cloudinary:", err);
      }
    }
  };

  // Reorder items: move item from index to targetIndex
  const handleMove = (index: number, direction: "prev" | "next") => {
    if (!multiple) return;
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange(newItems);
  };

  // Add manual URL
  const handleAddManualUrl = () => {
    if (!manualInput.trim()) return;
    if (multiple) {
      onChange([...items, manualInput.trim()]);
    } else {
      onChange(manualInput.trim());
    }
    setManualInput("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with Label & Manual toggle */}
      <div className="flex items-center justify-between text-xs">
        <div>
          {label && <span className="font-semibold text-navy-900 block">{label}</span>}
          {description && (
            <span className="text-muted-foreground block text-[11px]">{description}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-primary hover:text-navy-950 font-medium text-[11px] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="size-3" />
          {manualMode ? "Use Uploader" : "Paste URL"}
        </button>
      </div>

      {/* Manual URL Input mode */}
      {manualMode ? (
        <div className="flex gap-2">
          <Input
            placeholder="https://res.cloudinary.com/... or https://..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddManualUrl}
            className="shrink-0 text-xs"
          >
            {multiple ? "Add" : "Set"}
          </Button>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200",
            dragActive
              ? "border-primary bg-primary/5 scale-[1.005]"
              : "border-border hover:border-primary/50 hover:bg-muted/30 bg-muted/10",
            uploading && "opacity-60 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypesString}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(Array.from(e.target.files));
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <LoaderCircle className="size-8 animate-spin text-primary" />
              <p className="text-xs font-semibold text-navy-900">
                Converting to WebP & uploading to Cloudinary...
              </p>
              <p className="text-[11px] text-muted-foreground">Folder: upayon/{folder}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-navy-50 text-primary mb-1">
                <UploadCloud className="size-5" />
              </div>
              <p className="text-xs font-semibold text-navy-900">
                Click to browse or drag & drop {multiple ? "images" : "an image"}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap justify-center">
                <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                  <Sparkles className="size-2.5" />
                  Auto WebP
                </span>
                <span>• Max 5MB each • JPG, PNG, WEBP</span>
                {allowVideo && <span>• MP4, WebM</span>}
                <span className="text-navy-800 font-mono text-[10px]">({folder}/)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Items Previews */}
      {items.length > 0 && (
        <div className="space-y-2 pt-1">
          {multiple ? (
            /* Multiple Images Grid with Reorder */
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((url, idx) => {
                const isVideo = url.endsWith(".mp4") || url.endsWith(".webm");
                return (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-muted shadow-2xs flex flex-col justify-between"
                  >
                    {isVideo ? (
                      <div className="flex size-full items-center justify-center bg-navy-950 text-white">
                        <Film className="size-8" />
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="size-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )}

                    {/* Order index pill */}
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      #{idx + 1}
                    </span>

                    {/* Cloudinary indicator */}
                    {url.includes("res.cloudinary.com") && (
                      <span className="absolute left-1.5 bottom-1.5 rounded bg-emerald-600/90 px-1 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
                        Cloudinary
                      </span>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, "prev");
                          }}
                          className="rounded bg-white/90 p-1 text-navy-950 hover:bg-white shadow-xs"
                          title="Move left"
                        >
                          <ChevronLeft className="size-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(url, idx);
                        }}
                        className="rounded bg-destructive p-1 text-white hover:bg-destructive/90 shadow-xs"
                        title="Delete from Cloudinary"
                      >
                        <X className="size-3.5" />
                      </button>

                      {idx < items.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, "next");
                          }}
                          className="rounded bg-white/90 p-1 text-navy-950 hover:bg-white shadow-xs"
                          title="Move right"
                        >
                          <ChevronRight className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Single Image Preview */
            <div className="relative rounded-lg border border-border overflow-hidden bg-muted flex items-center gap-3 p-2.5">
              <div className="size-16 rounded-md overflow-hidden bg-black/5 shrink-0 border border-border">
                {items[0].endsWith(".mp4") || items[0].endsWith(".webm") ? (
                  <div className="flex size-full items-center justify-center bg-navy-950 text-white">
                    <Film className="size-6" />
                  </div>
                ) : (
                  <img
                    src={items[0]}
                    alt="Preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <p className="font-mono text-muted-foreground truncate" title={items[0]}>
                  {items[0]}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {items[0].includes("res.cloudinary.com") ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <Sparkles className="size-2.5" />
                      Stored in Cloudinary (WebP)
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">External URL</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemove(items[0], 0)}
                  className="text-destructive hover:bg-destructive/10"
                  title="Remove image"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
