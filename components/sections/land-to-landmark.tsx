"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BrandMark } from "@/components/brand-logo";
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
const FLOOR_H = 44;
const FLOORS = 7; // ground-floor parking + 6 residential floors
const BASE_Y = 410; // top of the plinth
const floorYs = Array.from({ length: FLOORS }, (_, k) => BASE_Y - FLOOR_H * (k + 1));
const TOP_Y = floorYs[FLOORS - 1];

/* Front façade spans L→R; the side wall is drawn in oblique projection. */
const L = 260;
const R = 520;
const DX = 44;
const DY = 20;
const WALL = "#ffffff";
const SIDE = "#e2e4ef";
const ROOFTOP = "#eceef6";
const columnXs = [260, 383, 506]; // brick-clad columns, 14 wide
const bayXs = [274, 397]; // balcony bays, 109 wide
const BAY_W = 109;

/** y offset of the side wall at x (it recedes up and to the right). */
const skew = (x: number) => -((x - R) * DY) / DX;
/** Parallelogram on the side wall between x0..x1 and yTop..yBot. */
const sidePoly = (x0: number, x1: number, yTop: number, yBot: number) =>
  `${x0},${yTop + skew(x0)} ${x1},${yTop + skew(x1)} ${x1},${yBot + skew(x1)} ${x0},${yBot + skew(x0)}`;

const mastPoints = Array.from(
  { length: Math.floor((GROUND_Y - 64) / 24) + 1 },
  (_, i) => `${i % 2 ? 646 : 630},${GROUND_Y - i * 24}`,
).join(" ");

const skyline = [
  [20, 250, 60],
  [86, 292, 50],
  [142, 226, 64],
  [600, 268, 50],
  [656, 232, 64],
  [726, 300, 74],
] as const;

export function LandToLandmark() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const brickId = `ll-brick-${useId().replace(/:/g, "")}`;
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
          .from(q("[data-ll-city]"), { opacity: 0, y: 20, duration: 0.8, stagger: 0.06 }, "<")
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
            { scaleY: 0, opacity: 0, transformOrigin: "50% 100%", duration: 0.45, ease: "back.out(1.4)", stagger: 0.3 },
          )
          .fromTo(
            q("[data-ll-hook]"),
            { y: 0 },
            { y: 90, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 7 },
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
            q("[data-ll-sign]"),
            { scaleY: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(1.8)" },
            "<0.4",
          )
          // The landmark sign "switches on"
          .fromTo(
            q("[data-ll-sign-face]"),
            { opacity: 0.15 },
            { keyframes: { opacity: [0.15, 1, 0.3, 1, 0.6, 1] }, duration: 0.8, ease: "none" },
          )
          .from(
            q("[data-ll-win]"),
            { fillOpacity: 0.04, duration: 0.25, stagger: { each: 0.03, from: "random" } },
            "<",
          )
          .from(q("[data-ll-door]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.4 }, "<")
          .from(q("[data-ll-tree]"), { scale: 0, transformOrigin: "50% 100%", duration: 0.6, ease: "back.out(2)", stagger: 0.12 }, "<0.2")
          .from(q("[data-ll-car]"), { x: -320, duration: 1.4, ease: "power2.out" }, "<")
          .from(q("[data-ll-key]"), { scale: 0, y: 20, opacity: 0, duration: 0.7, ease: "back.out(2.2)" }, "<0.5");

        // Ambient: clouds drift slowly, independent of the story
        q("[data-ll-cloud]").forEach((cloud, i) => {
          gsap.to(cloud, { x: i ? -36 : 44, duration: 9 + i * 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

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
              className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4"
            >
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-purple px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-[13px]">
                <KeyRound className="size-3.5 sm:size-4" aria-hidden="true" />
                Keys handed over
              </span>
            </div>

            <svg
              viewBox="0 0 800 500"
              className="block h-auto w-full"
              role="img"
              aria-label="Illustration: an empty plot of land is planned, an Upayon residential building rises floor by floor with balconies and a rooftop garden, the Upayon sign lights up on the roof, and the keys are handed over."
            >
              <defs>
                {/* Brick cladding (solid tint + white mortar joints) */}
                <pattern id={brickId} width="14" height="8" patternUnits="userSpaceOnUse">
                  <rect width="14" height="8" fill={PURPLE} fillOpacity="0.3" />
                  <path d="M0 3.5H14M0 7.5H14M7 0V4M3.5 4V8M10.5 4V8" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Sky: sun, clouds, distant city */}
              <circle cx="150" cy="104" r="30" fill={PURPLE} fillOpacity="0.12" />
              {[
                { x: 70, y: 150, s: 1 },
                { x: 640, y: 128, s: 0.8 },
              ].map(({ x, y, s }) => (
                <g key={x} data-ll-cloud>
                  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff">
                    <rect x="0" y="8" width="96" height="18" rx="9" />
                    <circle cx="34" cy="10" r="14" />
                    <circle cx="58" cy="6" r="16" />
                  </g>
                </g>
              ))}
              {skyline.map(([x, y, w]) => (
                <g key={x} data-ll-city fill={NAVY}>
                  <rect x={x} y={y} width={w} height={GROUND_Y - y} fillOpacity="0.05" />
                  {Array.from({ length: Math.floor((GROUND_Y - y - 24) / 22) }, (_, r) => (
                    <rect key={r} x={x + 10} y={y + 14 + r * 22} width={w - 20} height="6" fillOpacity="0.04" />
                  ))}
                </g>
              ))}

              {/* Street: pavement, kerb, road with lane markings */}
              <g data-ll-ground>
                <rect x="0" y={GROUND_Y} width="800" height="22" fill={NAVY} fillOpacity="0.04" />
                <rect x="0" y={GROUND_Y + 22} width="800" height="58" fill={NAVY} fillOpacity="0.09" />
                <line x1="0" x2="800" y1={GROUND_Y} y2={GROUND_Y} stroke={NAVY} strokeOpacity="0.25" strokeWidth="2" />
                <line x1="0" x2="800" y1={GROUND_Y + 22} y2={GROUND_Y + 22} stroke={NAVY} strokeOpacity="0.18" strokeWidth="2" />
                {Array.from({ length: 14 }, (_, i) => (
                  <rect key={i} x={i * 60 + 10} y={GROUND_Y + 50} width="30" height="3" rx="1.5" fill="#ffffff" />
                ))}
              </g>
              <rect data-ll-plot x="248" y={GROUND_Y - 3} width="324" height="6" rx="3" fill={PURPLE} />
              {[246, 408, 570].map((x) => (
                <rect key={x} data-ll-peg x={x} y={GROUND_Y - 20} width="4" height="20" rx="1" fill={NAVY} />
              ))}

              {/* Land flag (hidden in the final scene) */}
              <g data-ll-flag opacity="0">
                <line x1="200" x2="200" y1="330" y2={GROUND_Y} stroke={NAVY} strokeWidth="3" />
                <polygon points="202,332 262,346 202,360" fill={PURPLE} />
              </g>

              {/* Blueprint */}
              <g data-ll-plan fill="none" stroke={PURPLE} strokeWidth="2">
                <rect data-ll-plan-outline x={L} y={TOP_Y} width={R - L} height={BASE_Y - TOP_Y} pathLength={1} />
                {floorYs.slice(0, -1).map((y) => (
                  <line key={y} data-ll-plan-line x1={L} x2={R} y1={y} y2={y} pathLength={1} />
                ))}
              </g>

              {/* Plinth + cast shadow */}
              <g data-ll-found>
                <polygon points={`${R + 8},${GROUND_Y} ${R + 110},${GROUND_Y} ${R + DX + 8},${BASE_Y - DY}`} fill={NAVY} fillOpacity="0.07" />
                <rect x={L - 8} y={BASE_Y} width={R - L + 16} height={GROUND_Y - BASE_Y} fill={NAVY} />
                <polygon points={sidePoly(R + 8, R + DX + 8, BASE_Y, GROUND_Y)} fill={NAVY} fillOpacity="0.8" />
              </g>

              {/* Floors (DOM order = bottom-up, so they stack as they animate) */}
              {floorYs.map((y, k) =>
                k === 0 ? (
                  /* Ground floor: open parking, entrance wall with Upayon plaque, glass lobby */
                  <g key={y} data-ll-floor>
                    <rect x={L} y={y} width={R - L} height={FLOOR_H} fill={NAVY} fillOpacity="0.16" />
                    <polygon points={sidePoly(R, R + DX, y, y + FLOOR_H)} fill={SIDE} />
                    <polygon points={sidePoly(R + 10, R + 34, y + 12, y + FLOOR_H)} fill={NAVY} fillOpacity="0.2" />
                    <Car x={280} y={BASE_Y} scale={0.62} />
                    <rect x="344" y={y} width="64" height={FLOOR_H} fill={WALL} />
                    <rect x="352" y={y + 13} width="48" height="15" rx="2" fill={PURPLE} />
                    <text
                      x="376"
                      y={y + 23.5}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="700"
                      fill="#ffffff"
                      textLength="36"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      UPAYON
                    </text>
                    <rect x="414" y={y + 7} width="90" height={FLOOR_H - 7} fill={WALL} stroke={PURPLE} strokeWidth="2" />
                    <line x1="431" x2="431" y1={y + 7} y2={BASE_Y} stroke={PURPLE} strokeWidth="1" />
                    <line x1="487" x2="487" y1={y + 7} y2={BASE_Y} stroke={PURPLE} strokeWidth="1" />
                    <rect data-ll-door x="446" y={y + 14} width="26" height={FLOOR_H - 14} fill={PURPLE} />
                    <rect x="408" y={y + 3} width="102" height="4" fill={PURPLE} />
                    {[L, 332, 508].map((px) => (
                      <rect key={px} x={px} y={y} width="12" height={FLOOR_H} fill={NAVY} />
                    ))}
                  </g>
                ) : (
                  /* Residential floor: brick columns, glazed bays, balconies, greenery */
                  <g key={y} data-ll-floor>
                    <rect x={L} y={y} width={R - L} height={FLOOR_H} fill={WALL} />
                    <polygon points={sidePoly(R, R + DX, y, y + FLOOR_H)} fill={SIDE} />
                    <polygon points={sidePoly(R + 11, R + 33, y + 9, y + 32)} fill={NAVY} fillOpacity="0.3" />
                    {columnXs.map((cx) => (
                      <rect key={cx} x={cx} y={y} width="14" height={FLOOR_H} fill={`url(#${brickId})`} />
                    ))}
                    {bayXs.map((bx, bi) => {
                      const lit = (k + bi) % 3 === 0;
                      const green = (k + bi) % 2 === 1;
                      return (
                        <g key={bx}>
                          <rect
                            data-ll-win
                            x={bx + 8}
                            y={y + 7}
                            width={BAY_W - 16}
                            height="24"
                            fill={lit ? PURPLE : NAVY}
                            fillOpacity={lit ? 0.45 : 0.2}
                            stroke={NAVY}
                            strokeWidth="1.5"
                          />
                          <line x1={bx + 39} x2={bx + 39} y1={y + 7} y2={y + 31} stroke={NAVY} strokeWidth="1.2" />
                          <line x1={bx + 70} x2={bx + 70} y1={y + 7} y2={y + 31} stroke={NAVY} strokeWidth="1.2" />
                          <polygon
                            points={`${bx + 18},${y + 31} ${bx + 32},${y + 7} ${bx + 42},${y + 7} ${bx + 28},${y + 31}`}
                            fill="#ffffff"
                            fillOpacity="0.45"
                          />
                          {/* Glass balcony railing */}
                          <rect x={bx + 3} y={y + 30} width={BAY_W - 6} height="10" fill={NAVY} fillOpacity="0.08" />
                          <line x1={bx + 3} x2={bx + BAY_W - 3} y1={y + 30} y2={y + 30} stroke={NAVY} strokeWidth="1.5" />
                          {green && (
                            <g fill={PURPLE} fillOpacity="0.55">
                              <circle cx={bx + 12} cy={y + 30} r="6" />
                              <circle cx={bx + 22} cy={y + 29} r="7" />
                              <circle cx={bx + 33} cy={y + 30} r="5" />
                              <rect x={bx + 10} y={y + 30} width="4" height="12" rx="2" />
                              <rect x={bx + 21} y={y + 30} width="4" height="9" rx="2" />
                            </g>
                          )}
                        </g>
                      );
                    })}
                    {/* Floor slab / balcony edge */}
                    <rect x={L - 4} y={y + 40} width={R - L + 8} height="4" fill={NAVY} />
                    <polygon points={sidePoly(R + 4, R + DX, y + 40, y + 44)} fill={NAVY} />
                  </g>
                ),
              )}

              {/* Roof: top deck, stair room + tank, rooftop garden, Upayon landmark sign, parapet */}
              <g data-ll-roof>
                <polygon points={`${L},${TOP_Y} ${L + DX},${TOP_Y - DY} ${R + DX},${TOP_Y - DY} ${R},${TOP_Y}`} fill={ROOFTOP} />
                <rect x="464" y={TOP_Y - 32} width="38" height="28" fill={NAVY} />
                <polygon points={`502,${TOP_Y - 32} 512,${TOP_Y - 37} 512,${TOP_Y - 9} 502,${TOP_Y - 4}`} fill={NAVY} fillOpacity="0.7" />
                <rect x="470" y={TOP_Y - 40} width="26" height="8" rx="2" fill={NAVY} fillOpacity="0.55" />
                <g fill={PURPLE}>
                  <circle cx="300" cy={TOP_Y - 22} r="11" fillOpacity="0.4" />
                  <circle cx="288" cy={TOP_Y - 10} r="8" fillOpacity="0.55" />
                  <circle cx="304" cy={TOP_Y - 9} r="9" fillOpacity="0.55" />
                  <circle cx="320" cy={TOP_Y - 11} r="8" fillOpacity="0.45" />
                  <circle cx="335" cy={TOP_Y - 9} r="7" fillOpacity="0.55" />
                </g>

                <g data-ll-sign>
                  <rect x="376" y={TOP_Y - 28} width="3" height="24" fill={NAVY} />
                  <rect x="441" y={TOP_Y - 28} width="3" height="24" fill={NAVY} />
                  <rect x="340" y={TOP_Y - 62} width="140" height="35" rx="3" fill={WALL} stroke={NAVY} strokeWidth="2.5" />
                  <g data-ll-sign-face>
                    <BrandMark x={356} y={TOP_Y - 56} width={20} height={23} />
                    <text
                      x="382"
                      y={TOP_Y - 37}
                      fontSize="19"
                      fontWeight="800"
                      fill={PURPLE}
                      textLength="82"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      UPAYON
                    </text>
                  </g>
                </g>

                <rect x={L - 4} y={TOP_Y - 8} width={R - L + 8} height="8" fill={NAVY} />
                <polygon points={sidePoly(R + 4, R + DX, TOP_Y - 8, TOP_Y)} fill={NAVY} />
              </g>

              {/* Street lamps */}
              {[160, 590].map((x) => (
                <g key={x}>
                  <rect x={x - 1.5} y={GROUND_Y - 62} width="3" height="62" fill={NAVY} />
                  <rect x={x - 1.5} y={GROUND_Y - 62} width="16" height="3" fill={NAVY} />
                  <rect x={x + 9} y={GROUND_Y - 59} width="9" height="4" rx="2" fill={PURPLE} />
                </g>
              ))}

              {/* Trees */}
              {[110, 214, 684, 752].map((x, i) => (
                <g key={x} data-ll-tree>
                  <rect x={x - 2.5} y={GROUND_Y - 34} width="5" height="34" fill={NAVY} />
                  <circle cx={x} cy={GROUND_Y - 48} r={i % 2 ? 18 : 22} fill={PURPLE} fillOpacity="0.3" />
                  <circle cx={x - 8} cy={GROUND_Y - 40} r="12" fill={PURPLE} fillOpacity="0.4" />
                  <circle cx={x + 9} cy={GROUND_Y - 42} r="11" fill={PURPLE} fillOpacity="0.45" />
                </g>
              ))}

              {/* Car arriving at handover */}
              <g data-ll-car>
                <Car x={84} y={GROUND_Y + 40} />
              </g>

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

/** Simple side-view car; (x, y) = rear bumper at ground level. */
function Car({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <polygon points="14,-15 23,-26 50,-26 60,-15" fill={NAVY} />
      <polygon points="20,-16 26,-23 36,-23 36,-16" fill="#ffffff" fillOpacity="0.7" />
      <polygon points="39,-16 39,-23 48,-23 54,-16" fill="#ffffff" fillOpacity="0.7" />
      <rect x="0" y="-16" width="74" height="11" rx="4" fill={NAVY} />
      <rect x="68" y="-13" width="5" height="3" rx="1" fill={PURPLE} />
      {[16, 58].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="-5" r="5.5" fill={NAVY} stroke="#ffffff" strokeWidth="1.5" />
          <circle cx={cx} cy="-5" r="1.8" fill="#ffffff" />
        </g>
      ))}
    </g>
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
