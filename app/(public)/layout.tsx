import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { WhatsappIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd } from "@/lib/seo";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Structured data: tells Google this is a real-estate business in Dhaka (address, map, phone). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c") }}
      />
      <SmoothScroll />
      <a
        className="fixed left-3 top-3 z-[100] -translate-y-[160%] rounded-lg bg-white px-4 py-2.5 text-navy-900 shadow-xl focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <div id="top">
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </div>
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-8px_rgba(37,211,102,0.6)] transition hover:scale-110"
      >
        <WhatsappIcon className="size-7" />
      </a>
    </>
  );
}
