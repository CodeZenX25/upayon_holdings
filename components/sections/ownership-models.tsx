"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, KeyRound, LandPlot, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * Corporate palette: light surfaces + ONE accent — the logo wordmark purple
 * (`brand-purple`). No gradients. The featured model is a solid purple card.
 */

interface Model {
  num: string;
  tag: string;
  title: string;
  Icon: LucideIcon;
  text: string;
  /** Headline figure pulled from the copy, e.g. "up to 30%". */
  stat: { value: number; unit: string; caption: string };
  points: string[];
  cta: string;
  href: string;
  featured: boolean;
}

const models: Model[] = [
  {
    num: "01",
    tag: "Cost-price advantage",
    title: "Land share co-ownership",
    Icon: LandPlot,
    text: "Co-own prime land in Bashundhara, Purbachal or Uttara directly registered in your name. Build together at cost price.",
    stat: { value: 30, unit: "%", caption: "savings vs market rates" },
    points: [
      "Direct title & mutation registered in your name",
      "Build at actual construction cost — no developer markup",
      "Transparent quarterly progress & expense reports",
    ],
    cta: "Discover land share",
    href: "/projects?type=land-share",
    featured: false,
  },
  {
    num: "02",
    tag: "Turnkey convenience",
    title: "Flat share & turnkey condominiums",
    Icon: KeyRound,
    text: "Own an individual flat in a ready or under-construction building, with premium finishing and a smooth, hassle-free handover.",
    stat: { value: 36, unit: "mo", caption: "interest-free instalments" },
    points: [
      "Flexible 12 – 36 month instalment plans",
      "Premium fittings with structural warranty",
      "Full developer warranty & after-sales service",
    ],
    cta: "Explore available flats",
    href: "/projects?type=flat-share",
    featured: true,
  },
];

export function OwnershipModels() {
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
          const [words] = q("[data-om-words]");
          const split = SplitText.create(words, { type: "words" });

          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: { trigger: q("[data-om-title]")[0], start: "top 85%" },
            })
            .from(q("[data-om-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
            .from(q("[data-om-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
            .from(
              split.words,
              { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 },
              0.15,
            )
            .fromTo(
              q("[data-om-accent]"),
              { clipPath: "inset(-20% 100% -20% 0%)" },
              {
                clipPath: "inset(-20% 0% -20% 0%)",
                duration: 1.3,
                ease: "expo.inOut",
                clearProps: "clipPath",
              },
              0.5,
            )
            .from(q("[data-om-fade]"), { opacity: 0, y: 40, duration: 1.1 }, 0.6);

          /* ---- Cards ---- */
          q("[data-om-card]").forEach((card, i) => {
            gsap.set(card, { transition: "none" });
            const counter = card.querySelector<HTMLElement>("[data-om-count]");
            const target = Number(counter?.dataset.omCount ?? 0);
            const state = { value: 0 };

            gsap
              .timeline({
                scrollTrigger: { trigger: card, start: "top 82%" },
                // Side by side on desktop → stagger; stacked on mobile → each on its own.
                delay: wide ? i * 0.2 : 0,
              })
              .fromTo(
                card,
                { clipPath: "inset(100% 0% 0% 0% round 28px)", y: 70 },
                {
                  clipPath: "inset(0% 0% 0% 0% round 28px)",
                  y: 0,
                  duration: 1.3,
                  ease: "expo.out",
                  clearProps: "clipPath,transform,transition",
                },
              )
              .from(
                card.querySelectorAll("[data-om-icon]"),
                { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(1.8)" },
                0.35,
              )
              .to(
                state,
                {
                  value: target,
                  duration: 1.6,
                  ease: "power2.out",
                  onUpdate: () => {
                    if (counter) counter.textContent = Math.round(state.value).toString();
                  },
                },
                0.4,
              )
              .from(
                card.querySelectorAll("[data-om-divider]"),
                { scaleX: 0, duration: 1, ease: "power3.inOut" },
                0.5,
              )
              .from(
                card.querySelectorAll("[data-om-point]"),
                { opacity: 0, x: -24, duration: 0.7, ease: "power3.out", stagger: 0.1 },
                0.7,
              )
              .from(
                card.querySelectorAll("[data-om-cta]"),
                { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" },
                1,
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
      id="models"
      className="relative overflow-hidden bg-white py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header (stacks below lg) ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-om-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-om-eyebrow-text>Smart ownership solutions</span>
            </p>
            <h2
              data-om-title
              className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[52px] xl:text-[60px]"
            >
              <span data-om-words>Explore construction &amp;</span>{" "}
              <span
                data-om-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                real estate models
              </span>
            </h2>
          </div>
          <p
            data-om-fade
            className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[18px] lg:col-span-4 lg:mb-3"
          >
            Two clear paths to ownership — choose the model that fits your family&apos;s investment
            goals.
          </p>
        </div>

        {/* ---- Model cards ---- */}
        <div className="mt-12 grid gap-5 sm:mt-14 lg:mt-14 lg:grid-cols-2 lg:gap-6 xl:mt-16">
          {models.map(({ num, tag, title, Icon, text, stat, points, cta, href, featured }) => (
            <article
              key={title}
              data-om-card
              className={cn(
                "group relative flex flex-col rounded-[28px] p-6 transition-shadow duration-500 sm:p-9 lg:p-9 xl:rounded-[32px] xl:p-11",
                featured
                  ? "bg-brand-purple text-white shadow-[0_40px_80px_-40px_rgba(123,76,168,0.8)]"
                  : "border border-navy-900/10 bg-paper text-navy-900 hover:shadow-[0_30px_60px_-30px_rgba(123,76,168,0.35)]",
              )}
            >
              {/* Top row: icon + number/tag */}
              <div className="flex items-center gap-4">
                <span
                  data-om-icon
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-2xl sm:size-14",
                    featured ? "bg-white text-brand-purple" : "bg-brand-purple text-white",
                  )}
                >
                  <Icon className="size-6 sm:size-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p
                  className={cn(
                    "flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] sm:text-[13px]",
                    featured ? "text-white/85" : "text-brand-purple",
                  )}
                >
                  <span aria-hidden="true" className="font-serif text-[15px] italic tracking-normal">
                    {num}
                  </span>
                  <span aria-hidden="true" className="h-px w-5 bg-current opacity-50" />
                  {tag}
                </p>
              </div>

              {/* Title + copy */}
              <h3 className="mt-6 text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[32px] xl:mt-7 xl:text-[36px]">
                {title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-[16px] leading-[1.7] sm:text-[17px]",
                  featured ? "text-white/85" : "text-slate-600",
                )}
              >
                {text}
              </p>

              <span
                data-om-divider
                aria-hidden="true"
                className={cn(
                  "my-6 block h-px origin-left xl:my-7",
                  featured ? "bg-white/25" : "bg-navy-900/10",
                )}
              />

              {/* Benefits */}
              <ul className="space-y-3.5">
                {points.map((point) => (
                  <li
                    key={point}
                    data-om-point
                    className="flex items-start gap-3 text-[15.5px] font-medium leading-snug sm:text-[16px]"
                  >
                    <span
                      className={cn(
                        "mt-px grid size-6 shrink-0 place-items-center rounded-full",
                        featured ? "bg-white text-brand-purple" : "bg-brand-purple text-white",
                      )}
                    >
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              {/* Footer: headline figure + CTA, pinned to the bottom so both cards align */}
              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-6 lg:mt-auto lg:pt-9">
                <div>
                  <p className="text-[40px] font-extrabold leading-none tracking-tight sm:text-[44px] xl:text-[48px]">
                    <span
                      className={cn(
                        "mr-2 align-middle text-[12px] font-bold uppercase tracking-[0.18em]",
                        featured ? "text-white/75" : "text-slate-500",
                      )}
                    >
                      Up to
                    </span>
                    <span data-om-count={stat.value}>{stat.value}</span>
                    <span className="ml-1 text-[0.45em] font-bold">{stat.unit}</span>
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[14px] font-medium",
                      featured ? "text-white/80" : "text-slate-600",
                    )}
                  >
                    {stat.caption}
                  </p>
                </div>
                <Link
                  data-om-cta
                  href={href}
                  className={cn(
                    "group/btn inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 sm:w-fit",
                    featured
                      ? "bg-white text-brand-purple hover:bg-navy-900 hover:text-white"
                      : "bg-brand-purple text-white hover:bg-navy-900",
                  )}
                >
                  {cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
