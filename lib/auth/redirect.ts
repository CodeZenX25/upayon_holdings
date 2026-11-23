const DEFAULT_REDIRECT = "/admin";

/** Only allow post-login redirects to admin pages on this site (no open redirect). */
export function safeAdminRedirect(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }
  if (next.includes("\\") || /[\u0000-\u001f]/.test(next)) {
    return DEFAULT_REDIRECT;
  }

  let url: URL;
  try {
    // Resolve against a dummy origin so "..", encoded segments etc. are normalised.
    url = new URL(next, "http://internal.invalid");
  } catch {
    return DEFAULT_REDIRECT;
  }

  const { origin, pathname, search } = url;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (origin !== "http://internal.invalid" || !isAdminPath || pathname === "/admin/login") {
    return DEFAULT_REDIRECT;
  }
  return `${pathname}${search}`;
}
