"use client";

import { useRef } from "react";
import { Clock3, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * Corporate palette: light surfaces + ONE accent — the logo wordmark purple (`brand-purple`).
 * No gradients — every surface is a solid fill.
 */

const milestones = ["Foundation", "Structure", "Finishing", "Handover"];

const sideFeatures: { Icon: LucideIcon; num: string; title: string; text: string; tags: string[] }[] = [
  {
    Icon: ShieldCheck,
    num: "02",
    title: "Quality construction",
    text: "Premium materials, structural audits at every stage, and finishing that exceeds industry standards for lasting value.",
    tags: ["Premium materials", "Structural audits"],
  },
  {
    Icon: Wallet,
    num: "03",
    title: "Secure payments",
    text: "Transparent, milestone-based instalments with verified documentation — no hidden costs, ever.",
    tags: ["Verified documents", "No hidden costs"],
  },
];

export function Features() {
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
          horizontal: "(min-width: 640px)",
        },
        (ctx) => {
          const { motion, horizontal } = ctx.conditions as { motion: boolean; horizontal: boolean };
          if (!motion) return;

          /* ---- Heading ----
           * Plain words rise without a mask (masks clip italic serif glyphs);
           * the accent phrase wipes in as one piece. */
          const [words] = q("[data-feat-words]");
          const split = SplitText.create(words, { type: "words" });

          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: { trigger: q("[data-feat-title]")[0], start: "top 85%" },
            })
            .from(q("[data-feat-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
            .from(q("[data-feat-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
            .from(
              split.words,
              { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 },
              0.15,
            )
            .fromTo(
              q("[data-feat-accent]"),
              { clipPath: "inset(-20% 100% -20% 0%)" },
              {
                clipPath: "inset(-20% 0% -20% 0%)",
                duration: 1.3,
                ease: "expo.inOut",
                clearProps: "clipPath",
              },
              0.5,
            )
            .from(q("[data-feat-fade]"), { opacity: 0, y: 40, duration: 1.1 }, 0.6);

          /* ---- Cards: wipe up, then icons + tags pop ---- */
          const cards = q("[data-feat-card]");
          gsap.set(cards, { transition: "none" });
          cards.forEach((card, i) => {
            gsap
              .timeline({
                // On phones the cards stack, so each one reveals on its own.
                scrollTrigger: { trigger: card, start: "top 85%" },
                delay: horizontal ? i * 0.15 : 0,
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
                card.querySelectorAll("[data-feat-icon]"),
                { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(1.8)" },
                0.4,
              )
              .from(
                card.querySelectorAll("[data-feat-tag]"),
                { opacity: 0, y: 14, duration: 0.6, ease: "power3.out", stagger: 0.06 },
                0.8,
              );
          });

          /* ---- Milestone track fills as you scroll ----
           * Horizontal from 640px up, vertical stepper on phones. Each dot fills
           * at its measured position along the rail. */
          const [rail] = q("[data-feat-rail]");
          const dots = q("[data-feat-dot]");
          const labels = q("[data-feat-label]");
          gsap.set(dots, { backgroundColor: "rgba(255,255,255,0)" });
          gsap.set(labels, { opacity: 0.45 });

          const railBox = rail.getBoundingClientRect();
          const at = (dot: Element) => {
            const box = dot.getBoundingClientRect();
            const pos = horizontal
              ? (box.left + box.width / 2 - railBox.left) / railBox.width
              : (box.top + box.height / 2 - railBox.top) / railBox.height;
            return gsap.utils.clamp(0, 1, pos);
          };

          const track = gsap.timeline({
            scrollTrigger: {
              trigger: q("[data-feat-track]")[0],
              start: "top 88%",
              end: horizontal ? "top 45%" : "bottom 60%",
              scrub: 0.6,
            },
          });
          track.fromTo(
            q("[data-feat-progress]"),
            horizontal ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
            { scaleX: 1, scaleY: 1, ease: "none", duration: 1 },
            0,
          );
          dots.forEach((dot, i) => {
            const t = at(dot);
            track.to(dot, { backgroundColor: "#ffffff", scale: 1.25, duration: 0.06 }, t);
            track.to(labels[i], { opacity: 1, duration: 0.06 }, t);
          });

          /* ---- Watermark drifts sideways with scroll ---- */
          gsap.fromTo(
            q("[data-feat-watermark]"),
            { xPercent: 8 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-paper py-20 text-navy-900 sm:py-24 lg:py-36"
    >
      {/* "UPAYON" watermark drifting behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-8 select-none overflow-hidden sm:top-6"
      >
        <p
          data-feat-watermark
          className="whitespace-nowrap text-center text-[26vw] font-extrabold leading-none tracking-tighter text-navy-900/[0.04] lg:text-[22vw]"
        >
          UPAYON
        </p>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header (stacks below lg) ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-feat-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-feat-eyebrow-text>Why Upayon</span>
            </p>
            <h2
              data-feat-title
              className="text-[36px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] lg:leading-[1.08]"
            >
              <span data-feat-words>Features that we are</span>{" "}
              <span
                data-feat-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                super proud of
              </span>
            </h2>
          </div>
          <p
            data-feat-fade
            className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[18px] lg:col-span-4 lg:mb-4 lg:text-[20px]"
          >
            Institutional standards, ethical ownership, and uncompromising build quality — in every
            single project.
          </p>
        </div>

        {/* ---- Bento grid: 1 col → 2 col (hero full width) → 12-col bento ---- */}
        <div
          data-feat-grid
          className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-6"
        >
          {/* Hero card: On-time handover — solid accent fill */}
          <article
            data-feat-card
            className="group relative flex flex-col overflow-hidden rounded-[28px] bg-brand-purple p-6 text-white transition-shadow duration-500 hover:shadow-[0_40px_90px_-35px_rgba(123,76,168,0.75)] sm:p-10 md:col-span-2 lg:col-span-7 lg:row-span-2 lg:rounded-[32px] lg:p-12"
          >
            <div className="flex items-start justify-between gap-6">
              <span
                data-feat-icon
                className="grid size-14 place-items-center rounded-2xl bg-white text-brand-purple sm:size-16 lg:size-20"
              >
                <Clock3 className="size-7 sm:size-8 lg:size-9" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className="font-serif text-[48px] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.55)] sm:text-[64px] lg:text-[88px]"
              >
                01
              </span>
            </div>

            <h3 className="mt-8 text-[30px] font-extrabold leading-[1.08] tracking-tight sm:mt-10 sm:text-[40px] lg:mt-12 lg:text-[52px]">
              On-time handover
            </h3>
            <p className="mt-4 max-w-lg text-[16px] leading-[1.75] text-white/85 sm:mt-5 sm:text-[18px] lg:text-[19px]">
              We work with tech-savvy engineers and planners so every milestone is tracked — and your
              keys arrive on the promised date.
            </p>

            {/* Milestone track: vertical stepper on phones, horizontal from sm */}
            <div data-feat-track className="mt-8 sm:mt-10 lg:mt-auto lg:pt-12">
              <div className="relative">
                <span
                  data-feat-rail
                  aria-hidden="true"
                  className="absolute bottom-[7px] left-[5px] top-[7px] w-1 overflow-hidden rounded-full bg-white/25 sm:bottom-auto sm:left-[7px] sm:right-[7px] sm:top-[5px] sm:h-1 sm:w-auto"
                >
                  <span
                    data-feat-progress
                    className="absolute inset-0 origin-top rounded-full bg-white sm:origin-left"
                  />
                </span>
                <ol className="relative flex flex-col gap-5 sm:flex-row sm:justify-between sm:gap-2">
                  {milestones.map((m, i) => (
                    <li
                      key={m}
                      className={cn(
                        "flex items-center gap-4 sm:flex-col sm:gap-3",
                        i === 0 && "sm:items-start",
                        i === milestones.length - 1 && "sm:items-end",
                        i > 0 && i < milestones.length - 1 && "sm:items-center",
                      )}
                    >
                      <span
                        data-feat-dot
                        className="size-3.5 shrink-0 rounded-full border-2 border-white bg-white"
                      />
                      <span
                        data-feat-label
                        className="text-[14px] font-bold uppercase tracking-[0.12em] sm:text-[12px] lg:text-[13px]"
                      >
                        {m}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>

          {/* Side cards — white surface, purple accent */}
          {sideFeatures.map(({ Icon, num, title, text, tags }) => (
            <article
              key={title}
              data-feat-card
              className="group relative overflow-hidden rounded-[28px] border border-navy-900/10 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(17,20,58,0.25)] transition-[border-color,box-shadow] duration-500 hover:border-brand-purple/50 hover:shadow-[0_30px_60px_-30px_rgba(123,76,168,0.45)] sm:p-8 lg:col-span-5 lg:rounded-[32px] lg:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-purple transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between gap-6">
                <span
                  data-feat-icon
                  className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-purple text-white sm:size-14 lg:size-16"
                >
                  <Icon className="size-6 sm:size-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-serif text-[44px] italic leading-none text-transparent [-webkit-text-stroke:1px_#7b4ca8] sm:text-[56px] lg:text-[72px]"
                >
                  {num}
                </span>
              </div>
              <h3 className="mt-6 text-[24px] font-extrabold leading-tight tracking-tight sm:mt-8 sm:text-[28px] lg:text-[34px]">
                {title}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.75] text-slate-600 sm:mt-4 sm:text-[17px] lg:text-[18px]">
                {text}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    data-feat-tag
                    className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3.5 py-1.5 text-[12px] font-semibold text-brand-purple sm:px-4 sm:text-[13px]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
