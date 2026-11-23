import "server-only";

/**
 * Fixed-window, in-memory rate limiter.
 *
 * NOTE: state lives in this server process. On serverless / multi-instance
 * hosting each instance keeps its own counters — swap this for a shared store
 * (e.g. Redis/Upstash or a MongoDB TTL collection) before scaling out.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

declare global {
  var loginRateLimitBuckets: Map<string, Bucket> | undefined;
}

const buckets = (globalThis.loginRateLimitBuckets ??= new Map<string, Bucket>());

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds,
  };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Best-effort client IP. `x-forwarded-for` is only trustworthy when the app
 * runs behind a proxy that overwrites it (Vercel, Nginx, Cloudflare, …).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return ip.slice(0, 64);
}
