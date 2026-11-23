import { NextResponse, type NextRequest } from "next/server";
import { requirePermission } from "@/lib/auth/server";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  type CloudinaryFolder,
  isConfigured,
} from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const VALID_FOLDERS: Set<CloudinaryFolder> = new Set([
  "projects",
  "gallery",
  "blog",
  "testimonials",
]);

export async function POST(request: NextRequest) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();

    // Determine target folder (defaults to "projects")
    const requestedFolder = formData.get("folder") as string | null;
    const folder: CloudinaryFolder =
      requestedFolder && VALID_FOLDERS.has(requestedFolder as CloudinaryFolder)
        ? (requestedFolder as CloudinaryFolder)
        : "projects";

    // Collect all uploaded files (supports "file", "files", or multiple fields)
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && (key === "file" || key === "files" || key.startsWith("file"))) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No image files provided for upload." },
        { status: 400 }
      );
    }

    if (!isConfigured) {
      return NextResponse.json(
        {
          message:
            "Cloudinary credentials are not configured in environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
        },
        { status: 503 }
      );
    }

    // Validate size and mime types
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            message: `File "${file.name}" exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
          },
          { status: 400 }
        );
      }

      const isImage = ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase());
      const isVideo = ALLOWED_VIDEO_TYPES.has(file.type.toLowerCase());

      if (!isImage && !isVideo) {
        return NextResponse.json(
          {
            message: `Unsupported file type "${file.type}". Allowed formats: JPG, PNG, WEBP (and MP4/WebM for gallery videos).`,
          },
          { status: 400 }
        );
      }
    }

    // Process and upload each file to Cloudinary in parallel
    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const isVideo = ALLOWED_VIDEO_TYPES.has(file.type.toLowerCase());

      return uploadToCloudinary(buffer, folder, {
        isVideo,
        resourceType: isVideo ? "video" : "image",
      });
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls: results.map((r) => r.url),
      files: results,
      // Convenience property for single file callers
      url: results[0]?.url,
    });
  } catch (error) {
    console.error("Cloudinary POST /api/upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image(s)";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requirePermission("content:write");
  if (!auth.ok) return auth.response;

  try {
    let urlToDelete: string | null = null;
    let resourceType: "image" | "video" | "raw" | undefined = undefined;

    // Check query params first
    const { searchParams } = new URL(request.url);
    if (searchParams.get("url")) {
      urlToDelete = searchParams.get("url");
    }

    // Check JSON body if available
    if (!urlToDelete && request.body) {
      try {
        const body = await request.json();
        urlToDelete = body.url || body.publicId || body.public_id;
        resourceType = body.resourceType || body.resource_type;
      } catch {
        // ignore JSON parse error if body was empty
      }
    }

    if (!urlToDelete) {
      return NextResponse.json(
        { message: "Asset URL or public_id is required for deletion." },
        { status: 400 }
      );
    }

    const success = await deleteFromCloudinary(urlToDelete, resourceType);

    return NextResponse.json({
      success,
      message: success
        ? "Asset successfully deleted from Cloudinary."
        : "Asset not found or skipped (non-Cloudinary URL).",
    });
  } catch (error) {
    console.error("Cloudinary DELETE /api/upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete image";
    return NextResponse.json({ message }, { status: 500 });
  }
}
