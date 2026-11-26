/**
 * Video helpers shared by the admin form, validation and the public site.
 * A testimonial video is either a YouTube link or a video file we host on Cloudinary.
 */

export type ParsedVideo =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "file"; src: string; thumbnail?: string };

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

/** 11-char video id from any common YouTube link (watch, youtu.be, shorts, embed, live). */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!YOUTUBE_HOSTS.has(u.hostname)) return null;
    const id =
      u.hostname === "youtu.be"
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ??
          u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/)?.[1] ??
          null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** True for videos uploaded to our Cloudinary account (…/video/upload/…). */
function isCloudinaryVideo(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com" && u.pathname.includes("/video/upload/");
  } catch {
    return false;
  }
}

export function parseVideo(url?: string | null): ParsedVideo | null {
  if (!url) return null;
  const id = youtubeId(url);
  if (id) {
    return {
      kind: "youtube",
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (isCloudinaryVideo(url)) {
    // Cloudinary can render a poster frame: swap the extension for .jpg
    const thumbnail = url.replace(/\/video\/upload\//, "/video/upload/so_1/").replace(/\.[a-z0-9]+$/i, ".jpg");
    return { kind: "file", src: url, thumbnail };
  }
  return null;
}
