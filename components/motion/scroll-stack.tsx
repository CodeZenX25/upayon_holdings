"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Wraps the home page. Every direct `.stack-panel` child is pinned when it
 * reaches the viewport so the next section slides over it — a layered,
 * "one section at a time" scroll. Also drives reveal / split-text /
 * counter / parallax animations declared with data attributes.
 */
export function ScrollStack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = root.current;
      if (!container) return;
      const q = gsap.utils.selector(container);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          if (!motion) return;

          /* ---- Layered stacking panels ---- */
          const panels = gsap.utils.toArray<HTMLElement>(
            container.querySelectorAll(":scope > .stack-panel"),
          );

          if (desktop) {
            panels.forEach((panel, i) => {
              const next = panels[i + 1];
              if (!next) return;

              ScrollTrigger.create({
                trigger: panel,
                start: () =>
                  panel.offsetHeight < window.innerHeight
                    ? "top top"
                    : "bottom bottom",
                endTrigger: next,
                end: "top top",
                pin: true,
                pinSpacing: false,
              });

              const inner = panel.querySelector<HTMLElement>("[data-stack-inner]");
              if (inner) {
                gsap.to(inner, {
                  scale: 0.93,
                  opacity: 0.35,
                  filter: "blur(2px)",
                  ease: "none",
                  scrollTrigger: {
                    trigger: next,
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                  },
                });
              }
            });
          }

          /* ---- Hero intro ---- */
          const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
          heroTl
            .from(q("[data-hero-bg]"), { scale: 1.25, duration: 2.4 }, 0)
            .fromTo(
              q("[data-hero-item]"),
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.3,
                stagger: 0.12,
                clearProps: "transform,translate,opacity",
              },
              0.25,
            );

          q("[data-hero-bg]").forEach((bg) => {
            gsap.to(bg, {
              yPercent: 18,
              ease: "none",
              scrollTrigger: {
                trigger: bg.parentElement,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          });

          /* ---- Split headings: line by line ---- */
          q("[data-split]").forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "power4.out",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 85%" },
                }),
            });
          });

          /* ---- Fade-up reveals ----
           * Explicit end values (fromTo) — many cards carry a Tailwind
           * `transition` on opacity/transform, so a `from()` tween could read a
           * half-faded computed value as its end state and stay invisible.
           * CSS transitions are paused while GSAP animates, and inline styles
           * are cleared afterwards so hover utilities (translate) work again. */
          const reveal = (targets: Element[], from: gsap.TweenVars, vars: gsap.TweenVars) => {
            gsap.set(targets, { transition: "none" });
            gsap.fromTo(targets, from, {
              y: 0,
              opacity: 1,
              ease: "power3.out",
              clearProps: "transform,translate,opacity,transition",
              ...vars,
            });
          };

          q("[data-reveal]").forEach((el) => {
            reveal([el], { y: 60, opacity: 0 }, {
              duration: 1.1,
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

          q("[data-reveal-stagger]").forEach((group) => {
            reveal([...group.children], { y: 70, opacity: 0 }, {
              duration: 1,
              stagger: 0.14,
              scrollTrigger: { trigger: group, start: "top 85%" },
            });
          });

          /* ---- Image parallax inside cards ---- */
          q("[data-parallax]").forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

          /* ---- Counters ---- */
          q("[data-count]").forEach((el) => {
            const target = Number(el.dataset.count ?? 0);
            const state = { value: 0 };
            gsap.to(state, {
              value: target,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 90%" },
              onUpdate: () => {
                el.textContent = Math.round(state.value).toString();
              },
            });
          });

          /* ---- Horizontal marquee text ---- */
          q("[data-marquee]").forEach((el) => {
            const dir = el.dataset.marquee === "reverse" ? -1 : 1;
            gsap.fromTo(
              el,
              { xPercent: 5 * dir },
              {
                xPercent: -5 * dir,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        },
      );

      // Images load after first layout → recompute pin positions.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      // Web fonts change text height (and therefore pin positions).
      void document.fonts?.ready.then(refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
