"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { canOptimizeImage, optimizedVideoUrl, videoPosterUrl } from "@/lib/media-url";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

export interface BannerHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  isVideo: boolean;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor: string;
  textColor: string;
}

export function BannerHero({
  title,
  subtitle,
  image,
  isVideo,
  buttonText,
  buttonUrl,
  backgroundColor,
  textColor,
}: BannerHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q("[data-banner-item]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(items, { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, { autoAlpha: 1 });

        gsap.fromTo(
          q("[data-banner-media]"),
          { scale: 1.18 },
          { scale: 1, duration: 2.6, ease: "power2.out" }
        );

        const titleEl = q("[data-banner-title]")[0];
        const split = SplitText.create(titleEl, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 110,
              rotate: 4,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.07,
              delay: 0.25,
            });
          },
        });

        const tl = gsap.timeline({ delay: 0.75 });
        tl.from(q("[data-banner-line]"), {
          scaleX: 0,
          duration: 0.8,
          ease: "power3.inOut",
        })
          .from(
            q("[data-banner-subtitle]"),
            { y: 30, autoAlpha: 0, filter: "blur(8px)", duration: 1, ease: "power3.out" },
            "-=0.4"
          )
          .from(
            q("[data-banner-cta]"),
            { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .from(
            q("[data-banner-scroll]"),
            { y: -16, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
          );

        gsap.fromTo(
          q("[data-mouse-wheel]"),
          { y: 0, autoAlpha: 1 },
          {
            y: 12,
            autoAlpha: 0,
            duration: 1.4,
            ease: "power1.in",
            repeat: -1,
            repeatDelay: 0.3,
          }
        );

        gsap.to(q("[data-scroll-chevron]"), {
          y: 4,
          autoAlpha: 0.3,
          duration: 0.9,
          ease: "sine.inOut",
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  const scrollToNext = () => {
    const section = root.current;
    if (!section) return;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div data-banner-media className="relative size-full will-change-transform">
          {isVideo ? (
            <video
              src={optimizedVideoUrl(image)}
              poster={videoPosterUrl(image)}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="size-full object-cover"
            />
          ) : canOptimizeImage(image) ? (
            // The banner is the largest thing on screen — load it first, resized and compressed.
            <Image src={image} alt="" fill priority sizes="100vw" quality={70} className="object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" fetchPriority="high" decoding="async" className="size-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center md:px-8">
        <h1
          data-banner-item
          data-banner-title
          className="invisible font-serif text-4xl font-bold leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        <span
          data-banner-item
          data-banner-line
          aria-hidden="true"
          className="invisible mx-auto mt-6 block h-[3px] w-20 origin-center rounded-full bg-gold md:mt-8"
        />

        {subtitle && (
          <p
            data-banner-item
            data-banner-subtitle
            className="invisible mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] md:mt-8 md:text-lg lg:text-xl"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
        )}

        {buttonText && buttonUrl && (
          <div data-banner-item data-banner-cta className="invisible mt-9 md:mt-10">
            <Link
              href={buttonUrl}
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-navy-950 shadow-lg transition hover:bg-[#e6c47d]"
            >
              {buttonText}
              <ArrowRight
                className="size-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={scrollToNext}
        data-banner-item
        data-banner-scroll
        aria-label="Scroll to next section"
        className="invisible absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80 transition hover:text-white"
      >
        <span className="flex h-11 w-7 justify-center rounded-full border-2 border-current pt-2">
          <span data-mouse-wheel className="block h-2.5 w-1 rounded-full bg-current" />
        </span>
        <span className="flex flex-col items-center leading-none" aria-hidden="true">
          <svg data-scroll-chevron viewBox="0 0 12 6" className="h-1.5 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l5 4 5-4" />
          </svg>
          <svg data-scroll-chevron viewBox="0 0 12 6" className="h-1.5 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l5 4 5-4" />
          </svg>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
      </button>
    </section>
  );
}
