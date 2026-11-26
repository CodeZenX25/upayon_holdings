"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * About page — leadership & department heads (managed in Admin → Team).
 * Light surface + ONE accent (logo purple), no gradients.
 */

export interface TeamCardMember {
  id: string;
  name: string;
  designation: string;
  photo?: string;
  group: "leadership" | "department";
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function TeamSection({ members }: { members: TeamCardMember[] }) {
  const root = useRef<HTMLElement>(null);
  const leaders = members.filter((m) => m.group === "leadership");
  const heads = members.filter((m) => m.group === "department");

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const [words] = q("[data-tm-words]");
        const split = SplitText.create(words, { type: "words" });
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: q("[data-tm-title]")[0], start: "top 85%" },
          })
          .from(q("[data-tm-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
          .from(q("[data-tm-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
          .from(split.words, { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 }, 0.15)
          .fromTo(
            q("[data-tm-accent]"),
            { clipPath: "inset(-20% 100% -20% 0%)" },
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
            0.5,
          )
          .from(q("[data-tm-fade]"), { opacity: 0, y: 30, duration: 1 }, 0.6);

        q("[data-tm-grid]").forEach((grid) => {
          const cards = grid.querySelectorAll<HTMLElement>("[data-tm-card]");
          gsap
            .timeline({ scrollTrigger: { trigger: grid, start: "top 85%" } })
            .fromTo(
              cards,
              { clipPath: "inset(100% 0% 0% 0% round 24px)", y: 50 },
              {
                clipPath: "inset(0% 0% 0% 0% round 24px)",
                y: 0,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.12,
                clearProps: "clipPath,transform",
              },
            )
            .from(grid.querySelectorAll("[data-tm-photo]"), { scale: 1.15, duration: 1.4, ease: "expo.out", stagger: 0.12 }, 0)
            .from(
              grid.querySelectorAll("[data-tm-caption]"),
              { opacity: 0, y: 16, duration: 0.6, ease: "power3.out", stagger: 0.12 },
              0.45,
            );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  if (members.length === 0) return null;

  return (
    <section ref={root} className="relative overflow-hidden bg-white py-20 text-navy-900 sm:py-24 xl:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Header ---- */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:text-[13px] md:text-[14px]">
            <span data-tm-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
            <span data-tm-eyebrow-text>Our people</span>
            <span aria-hidden="true" className="h-0.5 w-10 bg-brand-purple sm:w-12" />
          </p>
          <h2
            data-tm-title
            className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[56px]"
          >
            <span data-tm-words>Visionary leaders &amp;</span>{" "}
            <span
              data-tm-accent
              className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
            >
              department heads
            </span>
          </h2>
          <p data-tm-fade className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.75] text-slate-600 sm:text-[18px]">
            The people who plan, build and stand behind every Upayon home.
          </p>
        </div>

        {/* ---- Leadership: large cards ---- */}
        {leaders.length > 0 && (
          <div
            data-tm-grid
            className={cn(
              "mx-auto mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:gap-7",
              leaders.length === 1 ? "max-w-md sm:grid-cols-1" : "max-w-[900px]",
            )}
          >
            {leaders.map((m) => (
              <MemberCard key={m.id} member={m} size="lg" />
            ))}
          </div>
        )}

        {/* ---- Department heads ---- */}
        {heads.length > 0 && (
          <div data-tm-grid className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:mt-7 lg:grid-cols-4 lg:gap-6">
            {heads.map((m) => (
              <MemberCard key={m.id} member={m} size="sm" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member, size }: { member: TeamCardMember; size: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <article
      data-tm-card
      className="group overflow-hidden rounded-[24px] border border-navy-900/10 bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-32px_rgba(123,76,168,0.5)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <div data-tm-photo className="absolute inset-0">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes={lg ? "(min-width: 640px) 440px, 100vw" : "(min-width: 1024px) 290px, (min-width: 768px) 33vw, 50vw"}
              className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center bg-brand-purple/10">
              <span
                className={cn(
                  "grid place-items-center rounded-full bg-brand-purple font-serif font-semibold italic text-white",
                  lg ? "size-32 text-[48px]" : "size-20 text-[30px] sm:size-24 sm:text-[36px]",
                )}
              >
                {initials(member.name)}
              </span>
            </div>
          )}
        </div>
        {lg && (
          <span aria-hidden="true" className="absolute left-0 top-6 h-10 w-1.5 rounded-r-full bg-brand-purple" />
        )}
      </div>

      <div data-tm-caption className={cn("border-t border-navy-900/10 text-center", lg ? "px-5 py-5" : "px-3 py-4")}>
        <p
          className={cn(
            "font-bold uppercase text-brand-purple",
            lg ? "text-[12.5px] tracking-[0.16em]" : "text-[10.5px] tracking-[0.12em] sm:text-[11.5px]",
          )}
        >
          {member.designation}
        </p>
        <h3
          className={cn(
            "mt-1.5 font-extrabold leading-tight tracking-tight text-navy-900",
            lg ? "text-[21px] sm:text-[23px]" : "text-[15px] sm:text-[17px]",
          )}
        >
          {member.name}
        </h3>
      </div>
    </article>
  );
}
