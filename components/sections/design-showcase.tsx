"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * "Design & living" — an architectural project tour.
 * One stage shows one render at a time with annotated hotspots; a tour list
 * explains the design idea behind each view and auto-advances.
 *
 * Palette: light surfaces + ONE accent (logo purple). No gradients.
 *
 * Hotspot coordinates are % of the STAGE (fixed 5:4 aspect at every
 * breakpoint), already corrected for each image's object-cover crop:
 *   square 1600² renders → 10% cropped top/bottom
 *   rooftop 1394×1600 at object-position 50% 20% → ~6% cropped top
 *   entrance 1600×1066 → ~8.3% cropped left/right
 * If an image is replaced, re-measure its hotspots.
 */

interface Hotspot {
  label: string;
  x: number;
  y: number;
  /** Which side of the pin the label sits on. */
  side: "left" | "right";
}

interface View {
  name: string;
  title: string;
  text: string;
  src: string;
  alt: string;
  position: string;
  spots: Hotspot[];
}

const views: View[] = [
  {
    name: "Front elevation",
    title: "Brick, white lines & greenery",
    text: "Warm brick columns and clean white bands give the building a calm, timeless presence on the street.",
    src: "/images/showcase/front-view.jpg",
    alt: "Front elevation of an Upayon residential building with brick columns and hanging greenery",
    position: "50% 50%",
    spots: [
      { label: "Hanging greenery", x: 47, y: 34, side: "right" },
      { label: "Brick-clad columns", x: 56, y: 66, side: "right" },
    ],
  },
  {
    name: "Rooftop garden",
    title: "Greenery at every level",
    text: "Planters on the balconies and a landscaped rooftop bring calm and fresh air into everyday city life.",
    src: "/images/showcase/rooftop-aerial.jpg",
    alt: "Aerial view of the landscaped rooftop garden",
    position: "50% 20%",
    spots: [
      { label: "Rooftop lawn", x: 54.5, y: 20, side: "right" },
      { label: "Planted courtyard", x: 41.6, y: 47, side: "left" },
    ],
  },
  {
    name: "Angled view",
    title: "Light and air in every home",
    text: "Wide balconies and generous openings let natural light and cross-ventilation reach each room.",
    src: "/images/showcase/angled-view.jpg",
    alt: "Angled view of a completed Upayon building surrounded by trees",
    position: "50% 50%",
    spots: [
      { label: "Large glazed openings", x: 53, y: 50, side: "left" },
      { label: "Wide balconies", x: 68.4, y: 74, side: "left" },
    ],
  },
  {
    name: "Gated entrance",
    title: "A safe, welcoming entrance",
    text: "A gated ground floor with covered parking keeps arrivals secure and the street front tidy.",
    src: "/images/showcase/street-entrance.jpg",
    alt: "Ground-floor gated entrance with covered parking",
    position: "50% 50%",
    spots: [
      { label: "Gated parking", x: 56.7, y: 71, side: "left" },
      { label: "Landscaped frontage", x: 83.7, y: 78, side: "left" },
    ],
  },
];

const AUTOPLAY_SECONDS = 6;
const pad = (n: number) => String(n).padStart(2, "0");

export function DesignShowcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(false);
  const firstRender = useRef(true);

  const go = useCallback(
    (i: number) => {
      const next = (i + views.length) % views.length;
      if (next === active) return;
      setPrev(active);
      setActive(next);
    },
    [active],
  );

  /* Respect reduced-motion (also disables autoplay) */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setMotionOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ---- Entrance animations + in-view tracking ---- */
  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      ScrollTrigger.create({
        trigger: q("[data-ds-stage]")[0],
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const [words] = q("[data-ds-words]");
        const split = SplitText.create(words, { type: "words" });

        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: q("[data-ds-title]")[0], start: "top 85%" },
          })
          .from(q("[data-ds-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
          .from(q("[data-ds-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
          .from(split.words, { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 }, 0.15)
          .fromTo(
            q("[data-ds-accent]"),
            { clipPath: "inset(-20% 100% -20% 0%)" },
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
            0.5,
          )
          .from(q("[data-ds-fade]"), { opacity: 0, y: 40, duration: 1.1 }, 0.6);

        gsap
          .timeline({ scrollTrigger: { trigger: q("[data-ds-stage]")[0], start: "top 82%" } })
          .fromTo(
            q("[data-ds-stage]"),
            { clipPath: "inset(100% 0% 0% 0% round 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.out", clearProps: "clipPath" },
          )
          .from(q("[data-ds-layer='0'] [data-ds-img]"), { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0)
          .from(q("[data-ds-chrome]"), { opacity: 0, duration: 0.6, stagger: 0.08 }, 0.6)
          .from(
            q("[data-ds-layer='0'] [data-ds-spot]"),
            { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.15 },
            0.9,
          )
          .from(q("[data-ds-item]"), { opacity: 0, x: 30, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.3);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  /* ---- View transition: wipe in from the right, image settles, pins pop ----
   * Layout effect so the incoming layer is clipped before the browser paints. */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const section = root.current;
    if (!section || !motionOk) return;
    const q = gsap.utils.selector(section);
    const layers = q("[data-ds-layer]");
    gsap.killTweensOf(layers);

    const layer = q(`[data-ds-layer='${active}']`)[0];
    if (prev !== null) gsap.set(q(`[data-ds-layer='${prev}']`), { clipPath: "inset(0% 0% 0% 0%)" });

    const tl = gsap.timeline();
    tl.fromTo(
      layer,
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" },
    )
      .fromTo(layer.querySelectorAll("[data-ds-img]"), { scale: 1.18 }, { scale: 1, duration: 1.5, ease: "expo.out" }, 0)
      .fromTo(
        layer.querySelectorAll("[data-ds-spot]"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.15 },
        0.75,
      )
      .fromTo(q("[data-ds-counter]"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.3);

    return () => {
      tl.kill();
    };
  }, [active, prev, motionOk]);

  /* ---- Autoplay with progress line (only while visible and not hovered) ---- */
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const bars = q("[data-ds-progress]");
    const bar = q(`[data-ds-progress='${active}']`)[0];
    gsap.set(bars, { scaleX: 0 });

    if (!motionOk) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }

    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTOPLAY_SECONDS,
        ease: "none",
        paused: !inView || paused,
        onComplete: () => go(active + 1),
      },
    );
    return () => {
      tween.kill();
    };
  }, [active, inView, paused, motionOk, go]);

  return (
    <section ref={root} className="relative overflow-hidden bg-paper py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-ds-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-ds-eyebrow-text>Design &amp; living</span>
            </p>
            <h2
              data-ds-title
              className="text-[32px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[36px] sm:text-[46px] lg:text-[50px] xl:text-[58px]"
            >
              <span data-ds-words>Homes designed to</span>{" "}
              <span
                data-ds-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                breathe
              </span>
            </h2>
          </div>
          <p
            data-ds-fade
            className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[17px] lg:col-span-5 lg:mb-3"
          >
            Every Upayon building balances modern architecture with nature — planned around the way
            families actually live. Take the tour.
          </p>
        </div>

        {/* ---- Tour: stage + list ---- */}
        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12 lg:items-center lg:gap-12 xl:mt-16">
          {/* Stage */}
          <div className="lg:col-span-7">
            <div
              data-ds-stage
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="relative aspect-[5/4] overflow-hidden rounded-[24px] bg-navy-900/5 shadow-[0_40px_80px_-40px_rgba(17,20,58,0.45)] sm:rounded-[28px]"
            >
              {views.map((v, i) => (
                <div
                  key={v.src}
                  data-ds-layer={i}
                  aria-hidden={i !== active}
                  className={cn(
                    "absolute inset-0",
                    i === active ? "z-20" : i === prev ? "z-10" : "invisible z-0",
                  )}
                >
                  <div data-ds-img className="absolute inset-0">
                    <Image
                      src={v.src}
                      alt={v.alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: v.position }}
                    />
                  </div>

                  {/* Hotspots */}
                  {v.spots.map((s) => (
                    <div
                      key={s.label}
                      className="absolute"
                      style={{ left: `${s.x}%`, top: `${s.y}%` }}
                    >
                      <div data-ds-spot className="relative">
                        <span className="absolute left-0 top-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-6">
                          <span className="absolute inset-0 animate-ping rounded-full bg-brand-purple/50" />
                          <span className="relative size-3 rounded-full border-[3px] border-white bg-brand-purple shadow-md sm:size-3.5" />
                        </span>
                        <span
                          className={cn(
                            "absolute top-0 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap",
                            s.side === "right" ? "left-3 sm:left-4" : "right-3 flex-row-reverse sm:right-4",
                          )}
                        >
                          <span className="h-px w-3 bg-white sm:w-5" />
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-semibold text-navy-900 shadow-lg sm:px-3 sm:py-1.5 sm:text-[12.5px]">
                            {s.label}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Architectural crop marks */}
              <div data-ds-chrome aria-hidden="true" className="pointer-events-none absolute inset-3 z-30 sm:inset-4">
                {[
                  "left-0 top-0 border-l-2 border-t-2",
                  "right-0 top-0 border-r-2 border-t-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ].map((c) => (
                  <span key={c} className={cn("absolute size-4 border-white sm:size-5", c)} />
                ))}
              </div>

              {/* View counter */}
              <div
                data-ds-chrome
                className="absolute left-5 top-5 z-30 flex items-center gap-2 overflow-hidden rounded-full bg-white px-3 py-1.5 shadow-md sm:left-7 sm:top-7 sm:px-4 sm:py-2"
              >
                <span className="text-[11px] font-bold tabular-nums text-brand-purple sm:text-[12px]">
                  {pad(active + 1)} / {pad(views.length)}
                </span>
                <span className="h-3 w-px bg-navy-900/15" />
                <span
                  data-ds-counter
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-900 sm:text-[12px]"
                >
                  {views[active].name}
                </span>
              </div>

              {/* Prev / next */}
              <div data-ds-chrome className="absolute bottom-5 right-5 z-30 flex gap-2 sm:bottom-7 sm:right-7">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous view"
                  className="grid size-9 place-items-center rounded-full bg-white text-navy-900 shadow-md transition-colors hover:bg-brand-purple hover:text-white sm:size-11"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next view"
                  className="grid size-9 place-items-center rounded-full bg-brand-purple text-white shadow-md transition-colors hover:bg-navy-900 sm:size-11"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Tour list */}
          <div className="lg:col-span-5">
            <ol
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label="Design tour"
            >
              {views.map((v, i) => {
                const isActive = i === active;
                return (
                  <li key={v.src} data-ds-item className="relative border-t border-navy-900/10 last:border-b">
                    <span
                      data-ds-progress={i}
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-px h-0.5 origin-left scale-x-0 bg-brand-purple"
                    />
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={isActive ? "true" : undefined}
                      className="group flex w-full gap-4 py-4 text-left sm:gap-5 sm:py-5"
                    >
                      <span
                        className={cn(
                          "w-7 shrink-0 pt-1 font-serif text-[15px] italic tabular-nums transition-colors duration-300 sm:text-[16px]",
                          isActive ? "text-brand-purple" : "text-slate-400",
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-[19px] font-bold leading-snug tracking-tight transition-colors duration-300 sm:text-[22px]",
                            isActive ? "text-navy-900" : "text-slate-400 group-hover:text-navy-900",
                          )}
                        >
                          {v.title}
                        </span>
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                            isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-2 text-[15.5px] leading-[1.7] text-slate-600 sm:text-[16.5px]">
                              {v.text}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <Link
              data-ds-item
              href="/projects"
              className="group/btn mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-purple px-6 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy-900 sm:w-fit"
            >
              View projects
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
