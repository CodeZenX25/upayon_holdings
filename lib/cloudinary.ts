import { v2 as cloudinary } from "cloudinary";

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary, isConfigured };

export type CloudinaryFolder = "projects" | "gallery" | "blog" | "testimonials";

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
  width?: number;
  height?: number;
}

/**
 * Extracts public_id and resource_type from a Cloudinary secure or standard URL.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v12345/upayon/projects/photo.webp
 * -> { publicId: "upayon/projects/photo", resourceType: "image" }
 */
export function extractCloudinaryPublicId(
  url: string
): { publicId: string; resourceType: "image" | "video" | "raw" } | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(
      /\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/
    );
    if (!match) return null;

    return {
      resourceType: match[1] as "image" | "video" | "raw",
      publicId: match[2],
    };
  } catch {
    return null;
  }
}

/**
 * Uploads a file buffer to Cloudinary in a specific folder, auto-converting images to webp.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: CloudinaryFolder,
  options: {
    resourceType?: "image" | "video" | "auto";
    isVideo?: boolean;
  } = {}
): Promise<UploadResult> {
  if (!isConfigured) {
    throw new Error(
      "Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment."
    );
  }

  const isVideo = Boolean(options.isVideo || options.resourceType === "video");
  const resourceType = isVideo ? "video" : "image";
  const targetFolder = `upayon/${folder}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: targetFolder,
        resource_type: resourceType,
        format: isVideo ? undefined : "webp", // auto-convert all images to webp
        transformation: isVideo
          ? undefined
          : [{ quality: "auto:good", fetch_format: "webp" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type,
            width: result.width,
            height: result.height,
          });
        }
      }
    );

    stream.end(fileBuffer);
  });
}

/**
 * Deletes an asset from Cloudinary given a full Cloudinary URL or publicId.
 */
export async function deleteFromCloudinary(
  urlOrPublicId: string,
  resourceType?: "image" | "video" | "raw"
): Promise<boolean> {
  if (!isConfigured || !urlOrPublicId) {
    return false;
  }

  let publicId = urlOrPublicId;
  let type: "image" | "video" | "raw" = resourceType || "image";

  if (urlOrPublicId.startsWith("http")) {
    const extracted = extractCloudinaryPublicId(urlOrPublicId);
    if (!extracted) {
      // Not a Cloudinary URL (e.g. Unsplash demo image), skip silently
      return false;
    }
    publicId = extracted.publicId;
    type = resourceType || extracted.resourceType;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
      invalidate: true,
    });
    return res.result === "ok";
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset (${publicId}):`, error);
    return false;
  }
}

/**
 * Deletes multiple assets from Cloudinary.
 */
export async function deleteMultipleFromCloudinary(
  urls: (string | undefined | null)[]
): Promise<void> {
  const validUrls = urls.filter((u): u is string => Boolean(u && typeof u === "string"));
  await Promise.allSettled(validUrls.map((url) => deleteFromCloudinary(url)));
}
