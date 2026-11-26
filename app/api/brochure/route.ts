import { type NextRequest } from "next/server";
import { brochureFileName, isUploadedBrochure } from "@/lib/brochure";
import { cloudinary, extractCloudinaryPublicId, isConfigured } from "@/lib/cloudinary";

/**
 * GET /api/brochure?url=<cloudinary pdf>&name=<file name>
 * Streams an uploaded brochure back as a download (Content-Disposition: attachment).
 * Only PDFs in this site's own Cloudinary account + upayon/ folder are served,
 * so the route can't be used as an open proxy.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  const allowed =
    Boolean(cloudName) &&
    isUploadedBrochure(url) &&
    new URL(url).pathname.startsWith(`/${cloudName}/raw/upload/`);

  if (!allowed) {
    return Response.json({ message: "Brochure not found." }, { status: 404 });
  }

  // Cloudinary accounts block public PDF delivery by default ("deny or ACL failure"),
  // so fetch through the signed download API, which that setting doesn't affect.
  const asset = extractCloudinaryPublicId(url);
  if (!asset || asset.resourceType !== "raw" || !isConfigured) {
    return Response.json({ message: "Brochure not found." }, { status: 404 });
  }
  const signedUrl = cloudinary.utils.private_download_url(asset.publicId, "", {
    resource_type: "raw",
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });

  const upstream = await fetch(signedUrl, { cache: "no-store" }).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return Response.json({ message: "Brochure is not available right now." }, { status: 502 });
  }

  // Name is re-sanitised here — never trust the query string in a header.
  const requested = (searchParams.get("name") ?? "").replace(/-Brochure\.pdf$/i, "");
  const fileName = brochureFileName(requested);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    // ?view=1 opens the PDF in the browser; default is a download
    "Content-Disposition": `${searchParams.get("view") === "1" ? "inline" : "attachment"}; filename="${fileName}"`,
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(upstream.body, { status: 200, headers });
}
