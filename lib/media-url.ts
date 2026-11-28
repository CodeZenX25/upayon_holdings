/**
 * Helpers for serving banner media quickly.
 * Kept free of server-only imports so client components can use them.
 */

/** Hosts allowed in next.config `images.remotePatterns` (plus local /public files). */
const OPTIMIZABLE_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com", "i.ytimg.com"]);

/** True when next/image can resize and compress this URL. */
export function canOptimizeImage(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

const CLOUDINARY_VIDEO = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(.+)$/;

/** True when the path after /upload/ already starts with a transformation (e.g. "q_auto,w_800/"). */
function hasTransform(rest: string) {
  return /^[a-z]{1,3}_[^/]+\//.test(rest);
}

/**
 * Cloudinary video → compressed, right-sized delivery (auto quality/codec, max 1920px wide).
 * Other URLs are returned unchanged.
 */
export function optimizedVideoUrl(src: string) {
  const match = CLOUDINARY_VIDEO.exec(src);
  if (!match || hasTransform(match[2])) return src;
  return `${match[1]}q_auto,vc_auto,w_1920,c_limit/${match[2]}`;
}

/**
 * Cloudinary video → a still JPG of the first frame, shown instantly while the
 * video downloads. Returns undefined for non-Cloudinary videos.
 */
export function videoPosterUrl(src: string) {
  const match = CLOUDINARY_VIDEO.exec(src);
  if (!match || hasTransform(match[2])) return undefined;
  const path = match[2].replace(/\.[a-z0-9]+$/i, "");
  return `${match[1]}so_0,q_auto,f_auto,w_1920,c_limit/${path}.jpg`;
}
