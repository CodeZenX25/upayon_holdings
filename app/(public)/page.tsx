import type { ReactNode } from "react";
import { ScrollStack } from "@/components/motion/scroll-stack";
import { AboutIntro } from "@/components/sections/about-intro";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Features } from "@/components/sections/features";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { Hero } from "@/components/sections/hero";
import { LatestProjects } from "@/components/sections/latest-projects";
import { LocationEnquiry } from "@/components/sections/location-enquiry";
import { OwnershipModels } from "@/components/sections/ownership-models";
import { Testimonial } from "@/components/sections/testimonial";
import { blogPosts, galleryItems, projects } from "@/lib/public-data";
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

export default function HomePage() {
  return (
    <ScrollStack>
      <Panel first bg="bg-navy-950">
        <Hero />
      </Panel>
      <Panel bg="bg-white">
        <AboutIntro />
      </Panel>
      <Panel bg="bg-paper">
        <LatestProjects projects={projects.slice(0, 3)} />
      </Panel>
      <Panel bg="bg-navy-900">
        <Features />
      </Panel>
      <Panel bg="bg-white">
        <OwnershipModels />
      </Panel>
      <Panel bg="bg-white">
        <GalleryShowcase items={galleryItems.slice(0, 4)} />
      </Panel>
      <Panel bg="bg-paper">
        <Testimonial />
      </Panel>
      <Panel bg="bg-white">
        <BlogPreview posts={blogPosts.slice(0, 3)} />
      </Panel>
      <Panel bg="bg-navy-950">
        <LocationEnquiry />
      </Panel>
    </ScrollStack>
  );
}
