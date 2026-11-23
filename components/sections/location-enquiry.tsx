import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { EnquiryForm } from "@/components/sections/enquiry-form";

export function LocationEnquiry() {
  return (
    <section id="location" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/3 size-[520px] rounded-full bg-navy-600/30 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <h2
            data-split
            className="text-[40px] font-extrabold uppercase tracking-[0.18em] md:text-[56px]"
          >
            Location
          </h2>
          <div
            data-reveal
            className="mt-8 overflow-hidden rounded-[28px] bg-white/5 ring-1 ring-white/10"
          >
            <iframe
              title="Upayon Holdings office location"
              src={siteConfig.mapEmbedSrc}
              className="h-[340px] w-full grayscale-[30%] md:h-[400px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div data-reveal className="mt-6 space-y-3 text-[15.5px] text-white/75">
            <p className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
              {siteConfig.address}
            </p>
            <a href={siteConfig.phoneHref} className="flex gap-3 hover:text-gold">
              <Phone className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <div>
          <h2
            data-split
            className="text-[40px] font-extrabold uppercase tracking-[0.18em] md:text-[56px]"
          >
            Enquiry
          </h2>
          <div data-reveal className="mt-8">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
