/**
 * CSRF defence-in-depth for cookie-authenticated mutations: when the browser
 * sends an `Origin` header it must match the host serving the request.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; sameSite=strict covers browsers
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
