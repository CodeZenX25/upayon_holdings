"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageIcon, Play, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  src: string;
  kind: "image" | "video";
  caption?: string;
}

interface ProjectMediaProps {
  title: string;
  images: string[];
  videos: string[];
}

export function ProjectMedia({ title, images, videos }: ProjectMediaProps) {
  const hasBoth = images.length > 0 && videos.length > 0;
  const [tab, setTab] = useState<"image" | "video">(images.length > 0 ? "image" : "video");
  const items: MediaItem[] =
    tab === "image"
      ? images.map((src) => ({ src, kind: "image" }))
      : videos.map((src) => ({ src, kind: "video" }));

  return (
    <div>
      {hasBoth && (
        <div className="mb-6 inline-flex rounded-full bg-slate-100 p-1" role="tablist" aria-label="Media type">
          {(
            [
              { key: "image", label: `Photos (${images.length})`, Icon: ImageIcon },
              { key: "video", label: `Videos (${videos.length})`, Icon: Video },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition",
                tab === key ? "bg-brand-purple text-white" : "text-slate-600 hover:text-navy-900",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
      <MediaSlider key={tab} title={title} items={items} />
    </div>
  );
}

function MediaThumb({ item, title, index, sizes }: { item: MediaItem; title: string; index: number; sizes: string }) {
  return item.kind === "image" ? (
    <Image
      src={item.src}
      alt={item.caption ?? `${title} photo ${index + 1}`}
      fill
      sizes={sizes}
      draggable={false}
      className="object-cover transition duration-700 group-hover:scale-105"
    />
  ) : (
    <>
      <video src={item.src} muted playsInline preload="metadata" className="size-full object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-navy-950/30">
        <span className="grid size-14 place-items-center rounded-full bg-white text-brand-purple shadow-lg transition group-hover:scale-110">
          <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
        </span>
      </span>
    </>
  );
}

export function MediaSlider({ title, items }: { title: string; items: MediaItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const updateCurrent = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    let nearest = 0;
    slides.forEach((slide, i) => {
      if (Math.abs(slide.offsetLeft - left) < Math.abs(slides[nearest].offsetLeft - left)) nearest = i;
    });
    setCurrent(nearest);
  }, []);

  const goTo = useCallback((index: number) => {
    const el = track.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (el && slide) el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;
  const single = items.length === 1;

  return (
    <div className="relative">
      <div
        ref={track}
        data-lenis-prevent
        onScroll={updateCurrent}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label={`${title} gallery`}
      >
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open ${item.kind === "video" ? "video" : "photo"} ${i + 1} of ${items.length} full size`}
            className={cn(
              "group relative aspect-[4/3] shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-200",
              single ? "w-full" : "w-[86%] sm:w-[70%] md:w-[calc(50%-8px)]",
            )}
          >
            <MediaThumb item={item} title={title} index={i} sizes="(min-width: 768px) 420px, 86vw" />
            {item.kind === "image" && (
              <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 shadow transition group-hover:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            )}
            {item.caption && (
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-navy-900 shadow">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {!single && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={item.src}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-7 bg-brand-purple" : "w-1.5 bg-slate-300",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-[14px] font-medium tabular-nums text-slate-500">
              {current + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              aria-label="Previous slide"
              className="grid size-11 place-items-center rounded-full border border-slate-200 text-navy-900 transition hover:border-brand-purple hover:bg-brand-purple hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(items.length - 1, current + 1))}
              disabled={current === items.length - 1}
              aria-label="Next slide"
              className="grid size-11 place-items-center rounded-full border border-slate-200 text-navy-900 transition hover:border-brand-purple hover:bg-brand-purple hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {open !== null && (
        <Lightbox
          title={title}
          items={items}
          index={open}
          onChange={(i) => {
            setOpen(i);
            goTo(i);
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

export function MediaGrid({ title, items }: { title: string; items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 text-left"
            aria-label={`Open ${item.caption ?? "image"} full size`}
          >
            <MediaThumb item={item} title={title} index={i} sizes="(min-width: 768px) 33vw, 50vw" />
            {item.caption && (
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-navy-900 shadow">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>
      {open !== null && (
        <Lightbox title={title} items={items} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function Lightbox({
  title,
  items,
  index,
  onChange,
  onClose,
}: {
  title: string;
  items: MediaItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const touchStart = useRef<number | null>(null);
  const step = useCallback(
    (dir: 1 | -1) => onChange((index + dir + items.length) % items.length),
    [index, items.length, onChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, step]);

  const item = items[index];
  const multiple = items.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/95 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} media viewer`}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null || !multiple) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      {multiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6"
            aria-label="Next"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </>
      )}

      <div className="relative h-full max-h-[85vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        {item.kind === "image" ? (
          <Image
            key={item.src}
            src={item.src}
            alt={item.caption ?? `${title} photo ${index + 1}`}
            fill
            sizes="100vw"
            quality={90}
            className="object-contain"
          />
        ) : (
          <video key={item.src} src={item.src} controls autoPlay playsInline className="size-full object-contain" />
        )}
      </div>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[14px] text-white/80">
        {item.caption ? `${item.caption} · ` : ""}
        {index + 1} / {items.length}
      </p>
    </div>,
    document.body,
  );
}
