/**
 * Brochure download helpers (safe on client and server).
 *
 * Browsers ignore the `download` attribute on cross-origin links, so Cloudinary
 * PDFs would just open in a tab. Uploaded brochures are therefore served through
 * our own /api/brochure route, which sends them as an attachment.
 */

/** True for PDFs we uploaded to Cloudinary (raw files in the upayon/ folder). */
export function isUploadedBrochure(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      /\/raw\/upload\/(?:v\d+\/)?upayon\//.test(parsed.pathname) &&
      parsed.pathname.toLowerCase().endsWith(".pdf")
    );
  } catch {
    return false;
  }
}

/** "Upayon Sagufta" → "Upayon-Sagufta-Brochure.pdf" (ASCII-safe for the download header). */
export function brochureFileName(name?: string): string {
  const base = (name ?? "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base || "Upayon"}-Brochure.pdf`;
}

/** Link that downloads the brochure. Uploaded PDFs go through /api/brochure; other links are used as-is. */
export function brochureDownloadHref(url: string, name?: string): string {
  if (!isUploadedBrochure(url)) return url;
  const params = new URLSearchParams({ url, name: brochureFileName(name) });
  return `/api/brochure?${params.toString()}`;
}

/** Link that opens the brochure in the browser's PDF viewer. */
export function brochureViewHref(url: string, name?: string): string {
  if (!isUploadedBrochure(url)) return url;
  const params = new URLSearchParams({ url, name: brochureFileName(name), view: "1" });
  return `/api/brochure?${params.toString()}`;
}
