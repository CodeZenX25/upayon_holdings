import { connectToDatabase } from "@/lib/db";
import { BannerModel, type Banner } from "@/models/banner";
import { BannerHero } from "@/components/sections/banner-hero";

async function getActiveBanners(): Promise<Banner[]> {
  try {
    await connectToDatabase();
    return await BannerModel.find({ isActive: true }).sort({ order: 1 }).lean<Banner[]>();
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}

export async function BannerSection() {
  const activeBanners = await getActiveBanners();

  if (activeBanners.length === 0) {
    return null;
  }

  const banner = activeBanners[0];

  const isVideo =
    banner.mediaType === "video" ||
    banner.image.endsWith(".mp4") ||
    banner.image.endsWith(".webm") ||
    banner.image.includes("/video/upload/");

  return (
    <BannerHero
      title={banner.title}
      subtitle={banner.subtitle}
      image={banner.image}
      isVideo={isVideo}
      buttonText={banner.buttonText}
      buttonUrl={banner.buttonUrl}
      backgroundColor={banner.backgroundColor || "#000000"}
      textColor={banner.textColor || "#ffffff"}
    />
  );
}
