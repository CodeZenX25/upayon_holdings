import type { ReactNode } from "react";
import { ScrollStack } from "@/components/motion/scroll-stack";
import { AboutIntro } from "@/components/sections/about-intro";
import { BannerSection } from "@/components/sections/banner-section";
import { BlogPreview } from "@/components/sections/blog-preview";
import { DesignShowcase } from "@/components/sections/design-showcase";
import { Features } from "@/components/sections/features";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { LandToLandmark } from "@/components/sections/land-to-landmark";
import { LatestProjects } from "@/components/sections/latest-projects";
import { LocationEnquiry } from "@/components/sections/location-enquiry";
import { OwnershipModels } from "@/components/sections/ownership-models";
import { Testimonial } from "@/components/sections/testimonial";
import { getProjects } from "@/lib/projects";
import { getActiveTestimonials } from "@/lib/testimonials";
import { blogPosts, galleryItems } from "@/lib/public-data";
import { cn } from "@/lib/utils";

/** One full-width layer of the stacked scroll; `bg` is the section colour. */
function Panel({ children, bg, first = false }: { children: ReactNode; bg: string; first?: boolean }) {
  return (
    <div className={cn("stack-panel overflow-hidden bg-navy-950", !first && "stack-over")}>
      <div data-stack-inner className={cn("origin-top", bg)}>
        {children}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [latestProjects, testimonials] = await Promise.all([getProjects(3), getActiveTestimonials()]);

  return (
    <>
      <BannerSection />
      <ScrollStack>
      <Panel bg="bg-white">
        <LandToLandmark />
      </Panel>
      <Panel bg="bg-white">
        <AboutIntro />
      </Panel>
      <Panel bg="bg-paper">
        <DesignShowcase />
      </Panel>
      <Panel bg="bg-paper">
        <LatestProjects projects={latestProjects} />
      </Panel>
      <Panel bg="bg-paper">
        <Features />
      </Panel>
      <Panel bg="bg-white">
        <OwnershipModels />
      </Panel>
      <Panel bg="bg-white">
        <GalleryShowcase items={galleryItems.slice(0, 4)} />
      </Panel>
      <Panel bg="bg-paper">
        <Testimonial items={testimonials} />
      </Panel>
      <Panel bg="bg-white">
        <BlogPreview posts={blogPosts.slice(0, 3)} />
      </Panel>
      <Panel bg="bg-paper">
        <LocationEnquiry />
      </Panel>
      </ScrollStack>
    </>
  );
}
