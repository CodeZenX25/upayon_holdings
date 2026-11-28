import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production audit build run alongside `next dev` (e.g. NEXT_DIST_DIR=.next-audit).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Local renders/photos: cache for a week, refresh in the background.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  images: {
    // Serve AVIF first (smallest), then WebP; cache optimised images for 30 days.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // YouTube thumbnails for video testimonials
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
