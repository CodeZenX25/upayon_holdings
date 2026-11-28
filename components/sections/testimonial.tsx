"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Quote, Star, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { parseVideo, type ParsedVideo } from "@/lib/video";import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * Client stories — coverflow carousel (auto-advances).
 *  Centre card large, neighbours smaller on each side, the rest hidden.
 *  - Video testimonial   → ONLY the video (poster + play button), no text.
 *  - Written testimonial → a quote card of the same size.
 * Light surface + ONE accent (logo purple), no gradients.
 */

export interface TestimonialItem {
  id: string;
  name?: string;
  photo?: string;
  projectName?: string;
  message?: string;
  rating: number;
  videoUrl?: string;
}

const SLIDE_SECONDS = 7;
/** Card size — shared by the invisible spacer (gives the stage its height) and every card. */
const CARD_SIZE = "w-[80%] aspect-[4/3] sm:w-[64%] sm:aspect-video lg:w-[56%] max-w-[700px]";

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Shortest signed distance from the active card, wrapping around the ends. */
function offsetOf(index: number, active: number, count: number) {
  let off = index - active;
  if (count > 2) {
    if (off > count / 2) off -= count;
    if (off < -count / 2) off += count;
  }
  return off;
}

export function Testimonial({ items }: { items: TestimonialItem[] }) {
  const root = useRef<HTMLElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const laidOut = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<ParsedVideo | null>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  const count = items.length;
  const go = (i: number) => setActive(((i % count) + count) % count);

  useEffect(() => {
    setMotionOk(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* ---- Entrance + in-view tracking ---- */
  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 25%",
        onToggle: (self) => setInView(self.isActive),
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const [words] = q("[data-ts-words]");
        const split = SplitText.create(words, { type: "words" });
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: q("[data-ts-title]")[0], start: "top 85%" },
          })
          .from(q("[data-ts-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
          .from(q("[data-ts-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
          .from(split.words, { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 }, 0.15)
          .fromTo(
            q("[data-ts-accent]"),
            { clipPath: "inset(-20% 100% -20% 0%)" },
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
            0.5,
          )
          .from(q("[data-ts-fade]"), { opacity: 0, y: 30, duration: 1 }, 0.6);

        gsap
          .timeline({ scrollTrigger: { trigger: q("[data-ts-stage]")[0], start: "top 85%" } })
          .from(q("[data-ts-stage]"), { y: 80, opacity: 0, duration: 1.2, ease: "expo.out" })
          .from(q("[data-ts-arrow]"), { scale: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1 }, 0.5)
          .from(q("[data-ts-dots]"), { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, 0.6);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  /* ---- Coverflow layout: centre big, neighbours smaller, the rest hidden ---- */
  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-ts-cover]", section);
    const animate = laidOut.current && motionOk;
    cards.forEach((card, i) => {
      const off = offsetOf(i, active, count);
      const abs = Math.abs(off);
      const vars = {
        xPercent: -50 + off * 74,
        scale: off === 0 ? 1 : 0.74,
        opacity: abs > 1 ? 0 : 1,
        zIndex: 10 - abs,
        pointerEvents: abs > 1 ? "none" : "auto",
      };
      if (animate) gsap.to(card, { ...vars, duration: 0.9, ease: "expo.out", overwrite: "auto" });
      else gsap.set(card, vars);
    });
    laidOut.current = true;
  }, [active, count, motionOk]);

  /* ---- Auto-advance: the active dot fills, then the next card slides in ---- */
  useEffect(() => {
    if (count < 2 || !motionOk) return;
    const bar = root.current?.querySelector(`[data-ts-progress="${active}"]`);
    if (!bar) return;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: SLIDE_SECONDS,
        ease: "none",
        paused: true,
        onComplete: () => setActive((a) => (a + 1) % count),
      },
    );
    timer.current = tween;
    return () => {
      tween.kill();
      timer.current = null;
    };
  }, [active, count, motionOk]);

  // Pause while hovered, off-screen, or while a video is playing
  useEffect(() => {
    const tween = timer.current;
    if (!tween) return;
    if (hovered || !inView || playing) tween.pause();
    else tween.play();
  }, [hovered, inView, playing, active, motionOk]);

  if (count === 0) return null;

  return (
    <section ref={root} className="relative overflow-hidden bg-paper py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-ts-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-ts-eyebrow-text>Client stories</span>
            </p>
            <h2
              data-ts-title
              className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[52px] xl:text-[60px]"
            >
              <span data-ts-words>Hear it from</span>{" "}
              <span
                data-ts-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                our families
              </span>
            </h2>
          </div>
          <p
            data-ts-fade
            className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[18px] lg:col-span-4 lg:mb-3"
          >
            Hear directly from the families who trusted Upayon Holdings.
          </p>
        </div>
      </div>

      {/* ---- Coverflow (full width so side cards can peek) ---- */}
      <div
        className="relative mx-auto mt-12 max-w-[1400px] sm:mt-14 xl:mt-16"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <div data-ts-stage className="relative">
          {/* Invisible spacer gives the stage the centre card's height */}
          <div aria-hidden="true" className={cn("invisible mx-auto", CARD_SIZE)} />

          {items.map((item, i) => {
            const video = parseVideo(item.videoUrl);
            const isActive = i === active;
            return (
              <div
                key={item.id}
                data-ts-cover
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute left-1/2 top-0 overflow-hidden rounded-[24px] lg:rounded-[28px]",
                  CARD_SIZE,
                  isActive
                    ? "shadow-[0_40px_70px_-35px_rgba(17,20,58,0.55)]"
                    : "shadow-[0_20px_40px_-30px_rgba(17,20,58,0.4)]",
                  // Without JS only the first card is visible
                  i !== 0 && "opacity-0",
                )}
              >
                {video ? (
                  <VideoCard
                    video={video}
                    poster={video.thumbnail ?? item.photo}
                    active={isActive}
                    onClick={() => (isActive ? setPlaying(video) : go(i))}
                  />
                ) : (
                  <QuoteCard item={item} active={isActive} onClick={() => !isActive && go(i)} />
                )}
              </div>
            );
          })}

          {count > 1 && (
            <>
              <button
                data-ts-arrow
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous testimonial"
                className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-brand-purple text-white shadow-lg transition-colors hover:bg-navy-900 sm:left-6 sm:size-12 lg:left-10"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                data-ts-arrow
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next testimonial"
                className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-brand-purple text-white shadow-lg transition-colors hover:bg-navy-900 sm:right-6 sm:size-12 lg:right-10"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* ---- Dots (active one fills while auto-playing) ---- */}
        {count > 1 && (
          <div data-ts-dots className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Choose a testimonial">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1}${t.videoUrl ? " (video)" : t.name ? ` from ${t.name}` : ""}`}
                onClick={() => go(i)}
                className={cn(
                  "relative h-2 overflow-hidden rounded-full bg-navy-900/15 transition-all duration-500 hover:bg-navy-900/25",
                  i === active ? "w-10" : "w-2",
                )}
              >
                {i === active && (
                  <span data-ts-progress={i} className="absolute inset-0 origin-left rounded-full bg-brand-purple" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}

/** Video testimonial: only the video — poster frame and play button, no text. */
function VideoCard({
  video,
  poster,
  active,
  onClick,
}: {
  video: ParsedVideo;
  poster?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={active ? 0 : -1}
      aria-label={active ? "Play client video testimonial" : "Show this video testimonial"}
      className="group relative block size-full bg-navy-900 outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-purple/50"
    >
      {poster ? (
        <Image
          src={poster}
          alt="Client video testimonial for Upayon Holdings"
          fill
          sizes="(min-width: 1024px) 700px, 80vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
      ) : video.kind === "file" ? (
        <video src={video.src} muted playsInline preload="metadata" className="size-full object-cover" />
      ) : null}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          active ? "bg-navy-950/15 group-hover:bg-navy-950/5" : "bg-white/25",
        )}
      />
      <span className="absolute inset-0 grid place-items-center">
        <span className={cn("relative grid place-items-center", active ? "size-16 sm:size-20" : "size-11 sm:size-14")}>
          {active && (
            <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-brand-purple/40 [animation-duration:2s]" />
          )}
          <span className="relative grid size-full place-items-center rounded-full bg-brand-purple text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className={cn("ml-0.5 fill-current", active ? "size-7 sm:size-8" : "size-5")} aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
}

/** Written testimonial in the same card size as a video. */
function QuoteCard({ item, active, onClick }: { item: TestimonialItem; active: boolean; onClick: () => void }) {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "flex size-full flex-col border border-navy-900/10 bg-white p-5 sm:p-7 lg:p-9",
        !active && "cursor-pointer",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-purple text-white sm:size-12 sm:rounded-2xl">
          <Quote className="size-5 fill-current sm:size-6" aria-hidden="true" />
        </span>
        <div className="flex gap-0.5 text-brand-purple" role="img" aria-label={`${item.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn("size-4", i < item.rating ? "fill-current" : "text-navy-900/15")}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <blockquote className="mt-4 line-clamp-4 font-serif text-[16px] font-medium italic leading-[1.55] text-navy-900 sm:mt-5 sm:text-[19px] lg:line-clamp-5 lg:text-[22px]">
        &ldquo;{item.message}&rdquo;
      </blockquote>

      <figcaption className="mt-auto flex min-w-0 items-center gap-3 border-t border-navy-900/10 pt-4">
        <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-purple/10 text-[13px] font-bold text-brand-purple sm:size-11">
          {item.photo ? <Image src={item.photo} alt={item.name ? `Photo of ${item.name}` : "Upayon Holdings client"} fill sizes="44px" className="object-cover" /> : initials(item.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-extrabold text-navy-900 sm:text-[16px]">{item.name}</span>
          <span className="block truncate text-[13px] text-slate-500">{item.projectName}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Full-screen player. Portaled to <body> so transformed scroll panels can't trap it. */
function VideoModal({ video, onClose }: { video: ParsedVideo; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Client video testimonial"
      className="fixed inset-0 z-[100] grid place-items-center bg-navy-950/90 p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white text-navy-900 transition-colors hover:bg-brand-purple hover:text-white"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
          {video.kind === "youtube" ? (
            <iframe
              src={video.embedUrl}
              title="Client video testimonial"
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={video.src} poster={video.thumbnail} controls autoPlay playsInline className="size-full" />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
