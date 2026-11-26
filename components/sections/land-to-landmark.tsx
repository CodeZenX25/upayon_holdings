"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * "What we do" story: raw land → blueprint → building rises → keys handed over.
 * One GSAP timeline drives an inline SVG scene; the step list follows along
 * and can be clicked to jump to a stage.
 *
 * Palette: navy + logo purple only, solid fills (no gradients).
 * The markup is the FINISHED scene, so without JS / with reduced motion the
 * visitor still sees a completed building.
 */

const NAVY = "#11143a";
const PURPLE = "#7b4ca8";

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

/* ---- Scene geometry (viewBox 0 0 800 500) ---- */
const GROUND_Y = 420;
const FLOOR_H = 46;
const FLOORS = 6;
const BASE_Y = 400; // top of the foundation slab
const floorYs = Array.from({ length: FLOORS }, (_, k) => BASE_Y - FLOOR_H * (k + 1));
const TOP_Y = floorYs[FLOORS - 1];
const windowXs = [262, 338, 414, 490];
const mastPoints = Array.from(
  { length: Math.floor((GROUND_Y - 64) / 24) + 1 },
  (_, i) => `${i % 2 ? 646 : 630},${GROUND_Y - i * 24}`,
).join(" ");

export function LandToLandmark() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
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
        const draw = { strokeDasharray: 1, strokeDashoffset: 1 };
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tlRef.current = tl;
        setActive(-1);

        // 1 · Land
        tl.addLabel("land")
          .call(() => setActive(0))
          .from(q("[data-ll-ground]"), { opacity: 0, duration: 0.6 })
          .from(q("[data-ll-plot]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, ease: "power2.inOut" }, "<0.2")
          .from(q("[data-ll-peg]"), { y: -40, opacity: 0, duration: 0.6, ease: "bounce.out", stagger: 0.12 }, "<0.3")
          .fromTo(
            q("[data-ll-flag]"),
            { opacity: 1, scaleY: 0, transformOrigin: "50% 100%" },
            { scaleY: 1, duration: 0.7, ease: "back.out(2)" },
            "<0.2",
          )
          .to({}, { duration: 0.5 });

        // 2 · Plan — blueprint lines draw themselves
        tl.addLabel("plan")
          .call(() => setActive(1))
          .fromTo(q("[data-ll-plan-outline]"), draw, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" })
          .fromTo(
            q("[data-ll-plan-line]"),
            draw,
            { strokeDashoffset: 0, duration: 0.5, ease: "power2.out", stagger: 0.12 },
            "<0.5",
          )
          .to({}, { duration: 0.4 });

        // 3 · Build — crane arrives, slab pours, floors stack up
        tl.addLabel("build")
          .call(() => setActive(2))
          .to(q("[data-ll-flag]"), { opacity: 0, duration: 0.3 })
          .fromTo(
            q("[data-ll-crane]"),
            { opacity: 1, scaleY: 0, transformOrigin: "50% 100%" },
            { scaleY: 1, duration: 0.8, ease: "power3.out" },
            "<",
          )
          .from(q("[data-ll-jib]"), { scaleX: 0, transformOrigin: "85% 50%", duration: 0.6 })
          .from(q("[data-ll-found]"), { scaleX: 0, transformOrigin: "50% 50%", duration: 0.6 }, "<0.2")
          .from(
            q("[data-ll-floor]"),
            { scaleY: 0, opacity: 0, transformOrigin: "50% 100%", duration: 0.45, ease: "back.out(1.4)", stagger: 0.35 },
          )
          .fromTo(
            q("[data-ll-hook]"),
            { y: 0 },
            { y: 90, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 5 },
            "<",
          )
          .to(q("[data-ll-plan]"), { opacity: 0.3, duration: 0.6 }, "<0.8");

        // 4 · Handover — crane leaves, roof on, lights on, keys
        tl.to({}, { duration: 0.2 })
          .addLabel("handover")
          .call(() => setActive(3))
          .to(q("[data-ll-crane]"), { x: 200, opacity: 0, duration: 0.8, ease: "power2.in" })
          .from(q("[data-ll-roof]"), { y: -40, opacity: 0, duration: 0.6, ease: "bounce.out" }, "<0.3")
          .from(
            q("[data-ll-win]"),
            { fillOpacity: 0.12, duration: 0.25, stagger: { each: 0.04, from: "random" } },
            "<0.2",
          )
          .from(q("[data-ll-door]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.4 }, "<")
          .from(q("[data-ll-tree]"), { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(2)", stagger: 0.15 }, "<0.3")
          .from(q("[data-ll-key]"), { scale: 0, y: 20, opacity: 0, duration: 0.7, ease: "back.out(2.2)" }, "<0.2");

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

        {/* ---- Animated scene ---- */}
        <div className="lg:col-span-7">
          <div
            data-ll-stage
            className="relative overflow-hidden rounded-[28px] border border-navy-900/10 bg-paper lg:rounded-[32px]"
          >
            <button
              type="button"
              onClick={replay}
              className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-navy-900 shadow-sm ring-1 ring-navy-900/10 transition-colors hover:bg-brand-purple hover:text-white sm:right-4 sm:top-4"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Replay
            </button>

            {/* Keys badge */}
            <div
              data-ll-key
              className="absolute left-1/2 top-[4%] z-10 -translate-x-1/2"
            >
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-purple px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-lg sm:px-4 sm:text-[13px]">
                <KeyRound className="size-4" aria-hidden="true" />
                Keys handed over
              </span>
            </div>

            <svg
              viewBox="0 0 800 500"
              className="block h-auto w-full"
              role="img"
              aria-label="Illustration: an empty plot of land is planned, a building rises floor by floor, and the keys are handed over."
            >
              {/* Ground */}
              <g data-ll-ground>
                <rect x="0" y={GROUND_Y} width="800" height="80" fill={NAVY} fillOpacity="0.05" />
                <line x1="0" x2="800" y1={GROUND_Y} y2={GROUND_Y} stroke={NAVY} strokeOpacity="0.25" strokeWidth="2" />
              </g>
              <rect data-ll-plot x="200" y={GROUND_Y - 3} width="400" height="6" rx="3" fill={PURPLE} />
              {[198, 398, 598].map((x) => (
                <rect key={x} data-ll-peg x={x} y={GROUND_Y - 20} width="4" height="20" rx="1" fill={NAVY} />
              ))}

              {/* Land flag (hidden in the final scene) */}
              <g data-ll-flag opacity="0">
                <line x1="170" x2="170" y1="330" y2={GROUND_Y} stroke={NAVY} strokeWidth="3" />
                <polygon points="172,332 232,346 172,360" fill={PURPLE} />
              </g>

              {/* Blueprint */}
              <g data-ll-plan fill="none" stroke={PURPLE} strokeWidth="2">
                <rect data-ll-plan-outline x="240" y={TOP_Y} width="320" height={BASE_Y - TOP_Y} pathLength={1} />
                {floorYs.slice(0, -1).map((y) => (
                  <line key={y} data-ll-plan-line x1="240" x2="560" y1={y} y2={y} pathLength={1} />
                ))}
              </g>

              {/* Foundation */}
              <rect data-ll-found x="228" y={BASE_Y} width="344" height={GROUND_Y - BASE_Y} rx="2" fill={NAVY} />

              {/* Floors */}
              {floorYs.map((y, k) => (
                <g key={y} data-ll-floor>
                  <rect x="240" y={y} width="320" height={FLOOR_H} fill="#ffffff" stroke={NAVY} strokeWidth="2" />
                  <rect x="236" y={y} width="328" height="5" fill={NAVY} />
                  {(k === 0 ? [windowXs[0], windowXs[3]] : windowXs).map((x) => (
                    <rect key={x} data-ll-win x={x} y={y + 15} width="48" height="22" rx="2" fill={PURPLE} fillOpacity="0.85" />
                  ))}
                  {k === 0 && <rect data-ll-door x="376" y={y + 10} width="48" height={FLOOR_H - 10} rx="2" fill={PURPLE} />}
                </g>
              ))}

              {/* Roof */}
              <g data-ll-roof>
                <rect x="232" y={TOP_Y - 12} width="336" height="12" rx="2" fill={NAVY} />
                <rect x="480" y={TOP_Y - 36} width="40" height="24" rx="3" fill={NAVY} />
              </g>

              {/* Trees */}
              {[130, 690].map((x) => (
                <g key={x} data-ll-tree>
                  <rect x={x - 3} y={GROUND_Y - 40} width="6" height="40" fill={NAVY} />
                  <circle cx={x} cy={GROUND_Y - 52} r="24" fill={PURPLE} fillOpacity="0.35" />
                </g>
              ))}

              {/* Tower crane (hidden in the final scene) */}
              <g data-ll-crane opacity="0">
                <polyline points={mastPoints} fill="none" stroke={NAVY} strokeWidth="2" />
                <line x1="630" x2="630" y1="64" y2={GROUND_Y} stroke={NAVY} strokeWidth="2" />
                <line x1="646" x2="646" y1="64" y2={GROUND_Y} stroke={NAVY} strokeWidth="2" />
                <g data-ll-jib>
                  <rect x="300" y="56" width="400" height="8" fill={NAVY} />
                  <rect x="670" y="64" width="30" height="18" fill={PURPLE} />
                  <rect x="622" y="66" width="32" height="22" rx="2" fill={PURPLE} />
                  <g data-ll-hook>
                    <line x1="420" x2="420" y1="64" y2="120" stroke={NAVY} strokeWidth="1.5" />
                    <rect x="410" y="120" width="20" height="14" rx="2" fill={PURPLE} />
                  </g>
                </g>
              </g>
            </svg>
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
