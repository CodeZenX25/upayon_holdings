"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, ExternalLink, FileText, Link as LinkIcon, LoaderCircle, UploadCloud, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ImageUploaderFolder } from "@/components/admin/image-uploader";
import {
  brochureDownloadHref,
  brochureFileName,
  brochureViewHref,
  isUploadedBrochure,
} from "@/lib/brochure";

const MAX_PDF_SIZE = 20 * 1024 * 1024; // keep in sync with /api/upload

interface BrochureUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder: ImageUploaderFolder;
  label?: string;
  description?: string;
  /** Used for the downloaded file name, e.g. the project title. */
  downloadName?: string;
}

/** Readable name from a brochure URL, e.g. ".../green-valley-lx2k.pdf" → "green-valley-lx2k.pdf". */
function fileNameFromUrl(url: string): string {
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    return last ? decodeURIComponent(last) : url;
  } catch {
    return url;
  }
}

/** Upload a PDF brochure to Cloudinary (or paste a link), then view / download / replace / remove it. */
export function BrochureUploader({
  value,
  onChange,
  folder,
  label,
  description,
  downloadName,
}: BrochureUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualInput, setManualInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(`"${file.name}" is not a PDF file.`);
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      toast.error(`"${file.name}" is larger than 20MB.`);
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("folder", folder);
      formData.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data: { url?: string; message?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Failed to upload brochure");

      const previous = value;
      onChange(data.url);
      toast.success("Brochure uploaded");
      if (previous) void deleteRemote(previous);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const deleteRemote = async (url: string) => {
    if (!url.includes("res.cloudinary.com")) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch (err) {
      console.error("Failed to delete brochure from Cloudinary:", err);
    }
  };

  const remove = () => {
    if (!value) return;
    const url = value;
    onChange("");
    void deleteRemote(url);
  };

  const setManual = () => {
    const url = manualInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("Enter a full link starting with https://");
      return;
    }
    onChange(url);
    setManualInput("");
    setManualMode(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 text-xs">
        <div className="min-w-0">
          {label && <span className="block font-semibold text-navy-900">{label}</span>}
          {description && <span className="block text-[11px] text-muted-foreground">{description}</span>}
        </div>
        <button
          type="button"
          onClick={() => setManualMode((m) => !m)}
          className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-navy-950"
        >
          <LinkIcon className="size-3" />
          {manualMode ? "Upload PDF" : "Paste URL"}
        </button>
      </div>

      {value ? (
        /* Current brochure */
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-brand-purple/10 text-brand-purple">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 text-xs">
              <p className="truncate font-semibold text-navy-900" title={value}>
                {fileNameFromUrl(value)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {value.includes("res.cloudinary.com") ? "Stored in Cloudinary" : "External link"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <a
              href={brochureViewHref(value, downloadName)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "xs", className: "text-xs" })}
            >
              <ExternalLink className="size-3.5" />
              View
            </a>
            <a
              href={brochureDownloadHref(value, downloadName)}
              download={brochureFileName(downloadName)}
              target={isUploadedBrochure(value) ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "xs", className: "text-xs" })}
            >
              <Download className="size-3.5" />
              Download
            </a>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="text-xs"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <LoaderCircle className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={remove}
              className="text-destructive hover:bg-destructive/10"
              title="Remove brochure"
              aria-label="Remove brochure"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      ) : manualMode ? (
        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <Input
            type="url"
            placeholder="https://example.com/brochures/project.pdf"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setManual();
              }
            }}
            className="text-xs"
          />
          <Button type="button" variant="outline" size="sm" onClick={setManual} className="shrink-0 text-xs">
            Set link
          </Button>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !uploading) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            void upload(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/10 hover:border-primary/50 hover:bg-muted/30",
            uploading && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <>
              <LoaderCircle className="size-7 animate-spin text-primary" />
              <p className="text-xs font-semibold text-navy-900">Uploading brochure…</p>
            </>
          ) : (
            <>
              <span className="mb-1 grid size-10 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
                <FileText className="size-5" />
              </span>
              <p className="text-xs font-semibold text-navy-900">Click to browse or drag & drop a PDF</p>
              <p className="text-[11px] text-muted-foreground">PDF only • Max 20MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => void upload(e.target.files?.[0])}
      />
    </div>
  );
}
