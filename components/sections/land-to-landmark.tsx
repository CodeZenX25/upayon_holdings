"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hammer, KeyRound, LandPlot, PencilRuler, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * "What we do" story, told on the REAL building render:
 *   land     → only the street & plot line are visible on a survey grid
 *   plan     → a purple blueprint of the building is scanned in, with dimensions
 *   build    → the photo rises floor by floor out of the blueprint
 *   handover → the Upayon sign lights up on the rooftop frame, keys handed over
 *
 * Overlays use an SVG with the image's own 1600×1600 coordinate space, so the
 * plot line, dimensions and rooftop sign stay locked to the building at every
 * screen size. The markup is the FINISHED scene (no-JS / reduced motion).
 * If the render is replaced, re-measure FLOOR_STOPS and the sign position.
 */

const SRC = "/images/showcase/front-view.jpg";
const NAVY = "#11143a";
const PURPLE = "#7b4ca8";

/** Clip edge (% from top) at the top of each level, bottom-up, measured on the render. */
const FLOOR_STOPS = [84, 75, 66, 56.5, 47.5, 38.5, 29.4, 20.3, 12, 0];
const LEVEL_NAMES = ["Ground floor", ...Array.from({ length: 8 }, (_, i) => `Level ${i + 1}`), "Rooftop"];
const GROUND_CLIP = 90; // land stage: only the street strip is visible

const steps = [
  {
    label: "land",
    title: "Acquire prime land",
    text: "We secure verified plots in prime Dhaka locations like Bashundhara, Purbachal and Uttara.",
  },
  {
    label: "plan",
    title: "Plan & design",
    text: "Architects and engineers plan every floor, structure and detail before work begins.",
  },
  {
    label: "build",
    title: "Build with quality",
    text: "Floors rise with premium materials, and every construction milestone is tracked.",
  },
  {
    label: "handover",
    title: "Hand over the keys",
    text: "Your flat or land share, registered in your name — delivered on the promised date.",
  },
] as const;

/** Icon for each stage in the status card (same order as `steps`). */
const stageIcons = [LandPlot, PencilRuler, Hammer, KeyRound];

const inset = (top: number) => `inset(${top}% 0% 0% 0%)`;

export function LandToLandmark() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const gridId = `ll-grid-${useId().replace(/:/g, "")}`;
  // Final state by default (all steps complete) — the timeline rewinds it.
  const [active, setActive] = useState<number>(steps.length - 1);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---- Heading ---- */
        const [words] = q("[data-ll-words]");
        const split = SplitText.create(words, { type: "words" });
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: q("[data-ll-title]")[0], start: "top 85%" },
          })
          .from(q("[data-ll-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
          .from(q("[data-ll-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
          .from(split.words, { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 }, 0.15)
          .fromTo(
            q("[data-ll-accent]"),
            { clipPath: "inset(-20% 100% -20% 0%)" },
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
            0.5,
          )
          .from(q("[data-ll-fade]"), { opacity: 0, y: 30, duration: 1, stagger: 0.1 }, 0.6);

        /* ---- The build story ---- */
        const photo = q("[data-ll-photo]");
        const rise = q("[data-ll-rise]");
        const levelText = section.querySelector<HTMLElement>("[data-ll-level-text]");
        const draw = { strokeDasharray: 1, strokeDashoffset: 1 };

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tlRef.current = tl;
        setActive(-1);

        // 1 · Land — street strip appears, plot is pegged out
        tl.addLabel("land")
          .call(() => setActive(0))
          .fromTo(photo, { clipPath: inset(100) }, { clipPath: inset(GROUND_CLIP), duration: 0.9, ease: "power2.inOut" })
          .fromTo(q("[data-ll-plot]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<0.4")
          .from(q("[data-ll-plot-line]"), { scaleX: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "power2.inOut" }, "<")
          .from(q("[data-ll-peg]"), { y: -60, opacity: 0, duration: 0.6, ease: "bounce.out", stagger: 0.12 }, "<0.4")
          .from(q("[data-ll-plot-tag]"), { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(2)" }, "<0.2")
          .to({}, { duration: 0.6 });

        // 2 · Plan — blueprint scans in left → right, dimensions draw
        tl.addLabel("plan")
          .call(() => setActive(1))
          .to(q("[data-ll-plot-tag]"), { opacity: 0, y: -10, duration: 0.3 })
          .fromTo(
            q("[data-ll-blueprint]"),
            { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" },
            { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power2.inOut" },
            "<",
          )
          .fromTo(q("[data-ll-dims]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<0.6")
          .fromTo(q("[data-ll-dim-line]"), draw, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.15 }, "<")
          .from(q("[data-ll-dim-label]"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.15 }, "<0.6")
          .to({}, { duration: 0.6 });

        // 3 · Build — the real photo rises out of the blueprint, level by level
        tl.addLabel("build")
          .call(() => setActive(2))
          .fromTo(rise, { opacity: 0, top: `${GROUND_CLIP}%` }, { opacity: 1, duration: 0.3 })
          .to(q("[data-ll-dims]"), { opacity: 0.35, duration: 0.4 }, "<");
        FLOOR_STOPS.forEach((stop, i) => {
          tl.call(() => {
            if (levelText) levelText.textContent = LEVEL_NAMES[i];
          })
            .to(photo, { clipPath: inset(stop), duration: 0.32, ease: "power2.inOut" })
            .to(rise, { top: `${stop}%`, duration: 0.32, ease: "power2.inOut" }, "<")
            .to({}, { duration: 0.08 });
        });
        tl.to(rise, { opacity: 0, duration: 0.3 })
          .to([q("[data-ll-dims]"), q("[data-ll-plot]")], { opacity: 0, duration: 0.4 }, "<");

        // 4 · Handover — camera settles, Upayon sign switches on, keys
        tl.addLabel("handover")
          .call(() => setActive(3))
          .from(q("[data-ll-zoom]"), { scale: 1.06, duration: 1.8, ease: "power2.out" })
          .from(q("[data-ll-sign]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(1.8)" }, "<0.1")
          .fromTo(
            q("[data-ll-sign-face]"),
            { opacity: 0.15 },
            { keyframes: { opacity: [0.15, 1, 0.3, 1, 0.6, 1] }, duration: 0.8, ease: "none" },
          )
          .fromTo(
            q("[data-ll-status-icon]"),
            { scale: 0.6, rotate: -20 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.2)" },
            "<0.3",
          );

        // Status card progress bar follows the whole story
        const bar = q("[data-ll-progress]");
        gsap.set(bar, { scaleX: 0 });
        tl.eventCallback("onUpdate", () => gsap.set(bar, { scaleX: tl.progress() }));

        ScrollTrigger.create({
          trigger: q("[data-ll-stage]")[0],
          start: "top 70%",
          once: true,
          onEnter: () => tl.play(0),
        });

        return () => {
          tlRef.current = null;
          setActive(steps.length - 1);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const jumpTo = (i: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    setActive(i);
    tl.play(steps[i].label);
  };

  const replay = () => {
    const tl = tlRef.current;
    if (!tl) return;
    setActive(-1);
    tl.play(0);
  };

  return (
    <section ref={root} className="relative overflow-hidden bg-white py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
        {/* ---- Copy + steps ---- */}
        <div className="lg:col-span-5">
          <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
            <span data-ll-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
            <span data-ll-eyebrow-text>What we do</span>
          </p>
          <h2
            data-ll-title
            className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[46px] xl:text-[54px]"
          >
            <span data-ll-words>From raw land to</span>{" "}
            <span
              data-ll-accent
              className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
            >
              your new home
            </span>
          </h2>
          <p data-ll-fade className="mt-5 max-w-lg text-[16px] leading-[1.75] text-slate-600 sm:text-[18px]">
            Upayon buys prime land, designs and builds quality residences, and sells land shares and
            flats — handling every step for you.
          </p>

          {/* Steps (desktop: here; phone/tablet: under the scene) */}
          <ol data-ll-fade className="mt-8 hidden space-y-2 lg:block">
            {steps.map((s, i) => (
              <StepItem key={s.label} index={i} step={s} active={active} onSelect={jumpTo} />
            ))}
          </ol>

          <Link
            data-ll-fade
            href="/projects"
            className="group/btn mt-8 hidden w-fit items-center gap-2.5 rounded-full bg-brand-purple px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy-900 lg:inline-flex"
          >
            See our projects
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* ---- Photo stage ---- */}
        <div className="lg:col-span-7">
          <div
            data-ll-stage
            role="img"
            aria-label="An Upayon residential building in Dhaka: the plot is pegged out, a blueprint is drawn, the building rises floor by floor, and the Upayon sign lights up on the roof."
            className="relative aspect-square overflow-hidden rounded-[28px] border border-navy-900/10 bg-paper lg:rounded-[32px]"
          >
            <div data-ll-zoom className="absolute inset-0">
              {/* Survey grid (visible before the building exists) */}
              <svg aria-hidden="true" className="absolute inset-0 size-full">
                <defs>
                  <pattern id={gridId} width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M32 0H0V32" fill="none" stroke={NAVY} strokeOpacity="0.07" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${gridId})`} />
              </svg>

              {/* Blueprint: the same render as a pale pencil sketch on drafting paper */}
              <div data-ll-blueprint aria-hidden="true" className="absolute inset-0 bg-white opacity-0">
                <Image
                  src={SRC}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className="object-cover opacity-45 mix-blend-multiply brightness-[1.35] contrast-[1.8] grayscale"
                />
                <svg className="absolute inset-0 size-full">
                  <defs>
                    <pattern id={`${gridId}-bp`} width="16" height="16" patternUnits="userSpaceOnUse">
                      <path d="M16 0H0V16" fill="none" stroke={PURPLE} strokeOpacity="0.12" strokeWidth="1" />
                    </pattern>
                    <pattern id={`${gridId}-bp-major`} width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M80 0H0V80" fill="none" stroke={PURPLE} strokeOpacity="0.22" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#${gridId}-bp)`} />
                  <rect width="100%" height="100%" fill={`url(#${gridId}-bp-major)`} />
                </svg>
              </div>

              {/* The real building (clipped bottom-up while it is "built") */}
              <div data-ll-photo className="absolute inset-0">
                <Image src={SRC} alt="" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
              </div>

              {/* Overlays, in the render's own 1600×1600 coordinates */}
              <svg viewBox="0 0 1600 1600" aria-hidden="true" className="absolute inset-0 size-full">
                {/* Plot pegged out (land) */}
                <g data-ll-plot opacity="0">
                  <line
                    data-ll-plot-line
                    x1="465"
                    x2="1185"
                    y1="1505"
                    y2="1505"
                    stroke={PURPLE}
                    strokeWidth="8"
                    strokeDasharray="22 14"
                  />
                  {[461, 1181].map((x) => (
                    <rect key={x} data-ll-peg x={x - 6} y="1450" width="12" height="60" rx="3" fill={PURPLE} />
                  ))}
                  <g data-ll-plot-tag>
                    <rect x="590" y="1290" width="420" height="72" rx="36" fill={PURPLE} />
                    <text
                      x="800"
                      y="1337"
                      textAnchor="middle"
                      fontSize="30"
                      fontWeight="700"
                      letterSpacing="4"
                      fill="#ffffff"
                    >
                      PLOT SECURED
                    </text>
                  </g>
                </g>

                {/* Dimensions (plan) */}
                <g data-ll-dims opacity="0" stroke={NAVY} strokeWidth="4">
                  <path data-ll-dim-line d="M1250 72V1500M1230 72H1270M1230 1500H1270" fill="none" pathLength={1} />
                  <path data-ll-dim-line d="M470 1560H1180M470 1540V1580M1180 1540V1580" fill="none" pathLength={1} />
                  <g data-ll-dim-label stroke="none">
                    <rect x="1182" y="756" width="136" height="60" rx="30" fill="#ffffff" />
                    <text x="1250" y="797" textAnchor="middle" fontSize="30" fontWeight="700" fill={PURPLE}>
                      G + 8
                    </text>
                  </g>
                  <g data-ll-dim-label stroke="none">
                    <rect x="700" y="1530" width="250" height="60" rx="30" fill="#ffffff" />
                    <text x="825" y="1571" textAnchor="middle" fontSize="28" fontWeight="700" fill={PURPLE}>
                      FRONTAGE
                    </text>
                  </g>
                </g>

                {/* Upayon landmark sign on the rooftop frame */}
                <g data-ll-sign>
                  <rect x="846" y="58" width="8" height="18" fill={NAVY} />
                  <rect x="946" y="58" width="8" height="18" fill={NAVY} />
                  <rect x="790" y="6" width="220" height="54" rx="6" fill="#ffffff" stroke={NAVY} strokeWidth="4" />
                  <g data-ll-sign-face>
                    <BrandMark x={808} y={14} width={34} height={39} />
                    <text
                      x="852"
                      y="48"
                      fontSize="34"
                      fontWeight="800"
                      fill={PURPLE}
                      textLength="140"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      UPAYON
                    </text>
                  </g>
                </g>
              </svg>

              {/* Rising construction line + level readout (build) */}
              <div data-ll-rise aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-full opacity-0">
                <div className="h-0.5 bg-brand-purple" />
                <span className="absolute right-[5%] top-0 -translate-y-full rounded-t-md bg-brand-purple px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:text-[12px]">
                  <span data-ll-level-text>Ground floor</span>
                </span>
              </div>
            </div>

          </div>

          {/* Status bar under the photo: current stage, progress, replay */}
          <div className="mt-4">
              <div className="flex items-center gap-3 rounded-2xl border border-navy-900/10 bg-white p-3 sm:gap-4 sm:p-4">
                <span
                  data-ll-status-icon
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-purple text-white"
                >
                  {(() => {
                    const StageIcon = stageIcons[Math.max(active, 0)];
                    return <StageIcon className="size-5" strokeWidth={1.75} aria-hidden="true" />;
                  })()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                    {active === steps.length - 1 ? "Completed" : `Stage 0${Math.max(active, 0) + 1} of 0${steps.length}`}
                  </p>
                  <p aria-live="polite" className="truncate text-[14.5px] font-bold text-navy-900 sm:text-[15px]">
                    {active === steps.length - 1 ? "Keys handed over" : steps[Math.max(active, 0)].title}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-navy-900/10">
                    <div data-ll-progress className="h-full origin-left rounded-full bg-brand-purple" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={replay}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy-900/10 px-3 py-2 text-[12.5px] font-semibold text-navy-900 transition-colors hover:border-brand-purple hover:bg-brand-purple hover:text-white sm:px-4"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  <span className="hidden min-[400px]:inline">Replay</span>
                  <span className="sr-only min-[400px]:hidden">Replay</span>
                </button>
              </div>
          </div>

          {/* Steps for phone/tablet */}
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
            {steps.map((s, i) => (
              <StepItem key={s.label} index={i} step={s} active={active} onSelect={jumpTo} compact />
            ))}
          </ol>

          <Link
            href="/projects"
            className="group/btn mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-purple px-6 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy-900 sm:w-fit lg:hidden"
          >
            See our projects
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  index,
  step,
  active,
  onSelect,
  compact = false,
}: {
  index: number;
  step: (typeof steps)[number];
  active: number;
  onSelect: (i: number) => void;
  compact?: boolean;
}) {
  const isActive = index === active;
  const isDone = index < active;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-current={isActive ? "step" : undefined}
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl border text-left transition-colors duration-300 sm:gap-4",
          compact ? "p-3 sm:p-4" : "p-4",
          isActive
            ? "border-brand-purple/40 bg-brand-purple/[0.06]"
            : "border-transparent hover:bg-paper",
        )}
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors duration-300 sm:size-9",
            isActive && "bg-brand-purple text-white",
            isDone && "bg-brand-purple/15 text-brand-purple",
            !isActive && !isDone && "bg-navy-900/[0.06] text-slate-400",
          )}
        >
          {index + 1}
        </span>
        <span className="min-w-0">
          <span
            className={cn(
              "block font-bold leading-snug transition-colors duration-300",
              compact ? "text-[14px] sm:text-[16px]" : "text-[17px]",
              isActive || isDone ? "text-navy-900" : "text-slate-400",
            )}
          >
            {step.title}
          </span>
          <span
            className={cn(
              "mt-1 text-[14px] leading-relaxed text-slate-600 sm:text-[15px]",
              compact ? "hidden sm:block" : "block",
            )}
          >
            {step.text}
          </span>
        </span>
      </button>
    </li>
  );
}
