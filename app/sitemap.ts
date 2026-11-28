import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { getProjects } from "@/lib/projects";
import { getConstructions } from "@/lib/constructions";
import { blogPosts } from "@/lib/public-data";

/** /sitemap.xml — every public page, including each project, construction and article. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, constructions] = await Promise.all([getProjects(), getConstructions()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/construction`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];
  const pages = staticPages.map((page) => ({ ...page, lastModified: now }));

  return [
    ...pages,
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [absoluteUrl(p.coverImage)],
    })),
    ...constructions.map((c) => ({
      url: `${siteUrl}/construction/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [absoluteUrl(c.coverImage)],
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
