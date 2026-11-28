import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";

/** /manifest.webmanifest — app name, icon and brand colour for phones and search engines. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.name,
    short_name: seo.shortName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7b4ca8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
