import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const gallery = [
  {
    src: "/images/showcase/front-view.jpg",
    alt: "Front elevation of an Upayon residential building with brick columns and hanging greenery",
    label: "Front elevation",
    className: "h-[340px] sm:h-[460px] lg:row-span-2 lg:h-full",
    sizes: "(min-width: 1024px) 58vw, 100vw",
  },
  {
    src: "/images/showcase/rooftop-aerial.jpg",
    alt: "Aerial view of the landscaped rooftop garden",
    label: "Rooftop garden",
    className: "h-[280px] sm:h-[320px]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
  },
  {
    src: "/images/showcase/street-entrance.jpg",
    alt: "Ground-floor gated entrance with covered parking",
    label: "Gated entrance",
    className: "h-[280px] sm:h-[320px]",
    sizes: "(min-width: 1024px) 42vw, 100vw",
  },
];

const features = [
  {
    title: "Greenery at every level",
    text: "Planters on the balconies and a landscaped rooftop bring calm, fresh air into everyday city life.",
  },
  {
    title: "Light and air in every home",
    text: "Wide balconies and generous openings let natural light and cross-ventilation reach each room.",
  },
  {
    title: "A safe, welcoming entrance",
    text: "A gated ground floor with covered parking keeps arrivals secure and the street front tidy.",
  },
];

export function DesignShowcase() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p
            data-reveal
            className="mb-5 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-purple"
          >
            <span className="h-px w-8 bg-brand-purple" />
            Design &amp; living
          </p>
          <h2
            data-split
            className="text-[34px] font-semibold leading-[1.15] tracking-tight text-navy-900 md:text-[50px] lg:text-[56px]"
          >
            Homes designed to <span className="text-brand-purple">breathe</span>
          </h2>
        </div>
        <p data-reveal className="text-[17px] leading-[1.8] text-slate-600 md:text-[18px]">
          Every Upayon building balances modern architecture with nature —
          warm brick, clean white lines and living greenery, planned around
          the way families actually live.
        </p>
      </div>

      <div
        data-reveal-stagger
        className="mt-12 grid gap-4 md:mt-16 md:gap-5 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-[320px_320px]"
      >
        {gallery.map(({ src, alt, label, className, sizes }, i) => (
          <figure
            key={src}
            className={cn("group relative overflow-hidden rounded-3xl bg-slate-200", className)}
          >
            <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={i === 0}
                className="object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-navy-900 shadow-md md:bottom-5 md:left-5">
              {label}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-16 grid items-center gap-10 md:mt-24 lg:grid-cols-2 lg:gap-16">
        <div
          data-reveal
          className="relative h-[380px] overflow-hidden rounded-3xl bg-slate-200 sm:h-[480px] lg:h-[580px]"
        >
          <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src="/images/showcase/angled-view.jpg"
              alt="Angled view of a completed Upayon building surrounded by trees"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <ol data-reveal-stagger className="divide-y divide-slate-200">
            {features.map(({ title, text }, i) => (
              <li key={title} className="flex gap-5 py-7 first:pt-0 md:gap-7">
                <span className="w-7 shrink-0 text-[15px] font-semibold tabular-nums text-brand-purple md:pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[22px] font-semibold leading-snug text-navy-900 md:text-[26px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[16px] leading-[1.75] text-slate-600 md:text-[17px]">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal className="pt-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-purple px-8 py-3.5 text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#6a3f93]"
            >
              View projects
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
