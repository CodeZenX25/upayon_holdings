import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** /robots.txt — public pages indexable; admin panel and APIs kept out of search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    // No `Host:` line — it is a non-standard Yandex directive that validators flag as invalid syntax.
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
