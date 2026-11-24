import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  videoUrl?: string;
  mediaType: "image" | "video";
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  backgroundColor?: string;
  textColor?: string;
}

async function getBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/banners`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as Banner[];
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}

export async function BannerSection() {
  const allBanners = await getBanners();
  const activeBanners = allBanners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);

  if (activeBanners.length === 0) {
    return null;
  }

  // For now, display the first active banner. Can be extended to a carousel later.
  const banner = activeBanners[0];

  const isVideo =
    banner.mediaType === "video" ||
    banner.image.endsWith(".mp4") ||
    banner.image.endsWith(".webm") ||
    banner.image.includes("/video/upload/");

  return (
    <section
      className="relative w-full h-96 md:h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: banner.backgroundColor || "#000000",
      }}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            src={banner.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6"
            style={{ color: banner.textColor || "#ffffff" }}
          >
            {banner.title}
          </h1>

          {banner.subtitle && (
            <p
              className="text-base md:text-lg lg:text-xl font-light mb-8 md:mb-10 leading-relaxed"
              style={{ color: banner.textColor || "#ffffff" }}
            >
              {banner.subtitle}
            </p>
          )}

          {banner.buttonText && banner.buttonUrl && (
            <Link href={banner.buttonUrl}>
              <Button
                size="lg"
                className="bg-primary hover:bg-navy-800 text-white font-semibold px-8 md:px-10"
              >
                {banner.buttonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
