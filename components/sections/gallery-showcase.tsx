"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { PublicGalleryItem } from "@/lib/public-data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * Corporate palette: light surface + ONE accent — the logo wordmark purple
 * (`brand-purple`). No gradients: captions sit on a solid white panel.
 */

/**
 * Bento rhythm, repeated every 4 items.
 * Phone/tablet: 2 columns (wide, half, half, wide). Desktop: 12-col bento
 * with one large feature tile on the left.
 */
const tiles = [
  {
    box: "col-span-2 h-[300px] sm:h-[400px] lg:col-span-6 lg:row-span-2 lg:h-auto",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    box: "h-[220px] sm:h-[300px] lg:col-span-6 lg:h-auto",
    sizes: "(min-width: 1024px) 50vw, 50vw",
  },
  {
    box: "h-[220px] sm:h-[300px] lg:col-span-3 lg:h-auto",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  {
    box: "col-span-2 h-[240px] sm:h-[320px] lg:col-span-3 lg:h-auto",
    sizes: "(min-width: 1024px) 25vw, 100vw",
  },
] as const;

export function GalleryShowcase({ items }: { items: PublicGalleryItem[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 1024px)",
        },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          if (!motion) return;

          /* ---- Heading ---- */
          const [words] = q("[data-gal-words]");
          const split = SplitText.create(words, { type: "words" });

          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: { trigger: q("[data-gal-title]")[0], start: "top 85%" },
            })
            .from(q("[data-gal-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
            .from(q("[data-gal-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
            .from(
              split.words,
              { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 },
              0.15,
            )
            .fromTo(
              q("[data-gal-accent]"),
              { clipPath: "inset(-20% 100% -20% 0%)" },
              {
                clipPath: "inset(-20% 0% -20% 0%)",
                duration: 1.3,
                ease: "expo.inOut",
                clearProps: "clipPath",
              },
              0.5,
            )
            .from(q("[data-gal-fade]"), { opacity: 0, y: 40, duration: 1.1, stagger: 0.12 }, 0.6);

          /* ---- Tiles: clip wipe + image settles from zoom + caption rises ---- */
          q("[data-gal-card]").forEach((card, i) => {
            gsap
              .timeline({
                scrollTrigger: { trigger: card, start: "top 85%" },
                delay: wide ? i * 0.12 : 0,
              })
              .fromTo(
                card,
                { clipPath: "inset(100% 0% 0% 0% round 24px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 24px)",
                  duration: 1.3,
                  ease: "expo.out",
                  clearProps: "clipPath",
                },
              )
              .from(
                card.querySelectorAll("[data-gal-zoom]"),
                { scale: 1.35, duration: 1.6, ease: "expo.out" },
                0,
              )
              .from(
                card.querySelectorAll("[data-gal-caption]"),
                { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
                0.5,
              );

            /* Gentle parallax inside each tile while scrolling */
            gsap.fromTo(
              card.querySelectorAll("[data-gal-parallax]"),
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header (stacks below lg) ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-gal-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-gal-eyebrow-text>Our portfolio</span>
            </p>
            <h2
              data-gal-title
              className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[52px] xl:text-[60px]"
            >
              <span data-gal-words>We make the ordinary…</span>{" "}
              <span
                data-gal-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                extraordinary!
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:mb-3">
            <p
              data-gal-fade
              className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[18px]"
            >
              A curated look at architecture, interiors and moments from the Upayon portfolio.
            </p>
            <Link
              data-gal-fade
              href="/gallery"
              className="group/btn hidden w-fit items-center gap-2.5 rounded-full bg-brand-purple px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy-900 lg:inline-flex"
            >
              View full gallery
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* ---- Bento gallery ---- */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[240px] lg:gap-5 xl:mt-16 xl:auto-rows-[270px]">
          {items.map((item, i) => {
            const tile = tiles[i % tiles.length];
            const small = i % tiles.length === 1 || i % tiles.length === 2;
            return (
              <Link
                key={item.title}
                href="/gallery"
                data-gal-card
                aria-label={`${item.title} — view in gallery`}
                className={cn(
                  "group relative block overflow-hidden rounded-3xl bg-paper outline-none ring-brand-purple focus-visible:ring-4",
                  tile.box,
                )}
              >
                {/* parallax wrapper is taller than the tile so it can drift */}
                <div data-gal-parallax className="absolute inset-x-0 -inset-y-[8%]">
                  <div data-gal-zoom className="relative size-full">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes={tile.sizes}
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Solid caption panel — readable on any photo */}
                <div
                  data-gal-caption
                  className={cn(
                    "absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-3 rounded-2xl bg-white shadow-[0_12px_30px_-12px_rgba(17,20,58,0.35)] sm:inset-x-4 sm:bottom-4",
                    small ? "p-3 sm:p-4" : "p-4 sm:p-5",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-purple sm:text-[11.5px]">
                      {item.category}
                    </p>
                    <p
                      className={cn(
                        "mt-1 font-bold leading-snug text-navy-900",
                        small ? "text-[14px] sm:text-[16px]" : "text-[16px] sm:text-[18px] lg:text-[20px]",
                      )}
                    >
                      {item.title}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "shrink-0 place-items-center rounded-full bg-brand-purple text-white transition-transform duration-500 group-hover:rotate-45",
                      small ? "hidden size-9 sm:grid" : "grid size-10 sm:size-11",
                    )}
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA for phones/tablets (desktop shows it in the header) */}
        <div className="mt-10 lg:hidden">
          <Link
            href="/gallery"
            className="group/btn inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-purple px-6 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy-900 sm:w-fit"
          >
            View full gallery
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
