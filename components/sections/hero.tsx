"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/models/site-settings";

interface HeroProps {
  slides?: HeroSlide[];
}

const fallbackSlide: HeroSlide = {
  title: "Building Spaces That Inspire",
  subtitle:
    "Upayon Holdings Ltd. is a trusted real estate developer in Bangladesh, delivering premium residential and commercial projects with exceptional craftsmanship, innovative design, and on-time completion.",
  image:
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=85",
  mediaType: "image",
  buttonText: "Explore Projects",
  buttonUrl: "/projects",
  order: 0,
};

export function Hero({ slides }: HeroProps) {
  const slideList = slides && slides.length > 0 ? slides : [fallbackSlide];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Auto rotate slides if multiple exist
  React.useEffect(() => {
    if (slideList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideList.length]);

  const activeSlide = slideList[currentIndex] || fallbackSlide;

  const mediaSrc =
    activeSlide.videoUrl ||
    activeSlide.image ||
    fallbackSlide.image;
  const isVideo =
    activeSlide.mediaType === "video" ||
    Boolean(activeSlide.videoUrl) ||
    mediaSrc?.endsWith(".mp4") ||
    mediaSrc?.endsWith(".webm") ||
    mediaSrc?.includes("/video/upload/");

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 text-white md:pb-20">
      {/* Background Media */}
      <div data-hero-bg className="absolute inset-0 -z-20 overflow-hidden">
        {isVideo ? (
          <video
            key={mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            className="size-full object-cover"
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            key={mediaSrc}
            src={mediaSrc}
            alt={activeSlide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Subtle clean dark overlay - no blue gradient, keeps video and text crisp */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      {/* Content Container */}
      <div className="mx-auto w-full max-w-[1240px] px-5 text-center md:px-8 my-auto">
        {/* Main Title - Clean, bold sans-serif matching reference */}
        <h1
          data-hero-item
          className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.14]"
        >
          {activeSlide.title}
        </h1>

        {/* Subtitle - Centered, readable white paragraph */}
        <p
          data-hero-item
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg font-normal"
        >
          {activeSlide.subtitle}
        </p>

        {/* Action Buttons */}
        <div data-hero-item className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={activeSlide.buttonUrl || "/projects"}
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-950 transition hover:bg-[#e6c47d] shadow-md"
          >
            {activeSlide.buttonText || "Explore Projects"}
            <ArrowRight
              className="size-4 transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white hover:text-navy-900"
          >
            Book a Consultation
          </Link>
        </div>

        {/* Slide Carousel Dots (if multiple slides exist) */}
        {slideList.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {slideList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-8 bg-gold"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Centered Mouse Scroll Down Indicator matching reference */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/75 pointer-events-none">
        <div className="w-5 h-8 rounded-full border-2 border-white/60 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
        </div>
        <span className="text-xs leading-none">↓</span>
      </div>
    </section>
  );
}
