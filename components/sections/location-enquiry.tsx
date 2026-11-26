"use client";

import { useRef } from "react";
import { Mail, MapPin, Navigation, Phone, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/lib/site-config";
import { EnquiryForm } from "@/components/sections/enquiry-form";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/*
 * Visit + enquiry. Light surface, ONE accent (logo purple), no gradients —
 * same split header and card language as the other home sections.
 */

const contacts: { Icon: LucideIcon; label: string; value: string; href: string; external?: boolean }[] = [
  {
    Icon: MapPin,
    label: "Office",
    value: siteConfig.address,
    href: siteConfig.mapDirectionsHref,
    external: true,
  },
  { Icon: Phone, label: "Call us", value: siteConfig.phone, href: siteConfig.phoneHref },
  { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
];

export function LocationEnquiry() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1024px)" },
        (ctx) => {
          const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
          if (!motion) return;

          /* ---- Heading ---- */
          const [words] = q("[data-le-words]");
          const split = SplitText.create(words, { type: "words" });
          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: { trigger: q("[data-le-title]")[0], start: "top 85%" },
            })
            .from(q("[data-le-eyebrow-line]"), { scaleX: 0, duration: 0.9 }, 0)
            .from(q("[data-le-eyebrow-text]"), { opacity: 0, x: -24, duration: 0.9 }, 0.1)
            .from(split.words, { y: 50, opacity: 0, filter: "blur(8px)", duration: 1.1, stagger: 0.07 }, 0.15)
            .fromTo(
              q("[data-le-accent]"),
              { clipPath: "inset(-20% 100% -20% 0%)" },
              { clipPath: "inset(-20% 0% -20% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" },
              0.5,
            )
            .from(q("[data-le-fade]"), { opacity: 0, y: 30, duration: 1 }, 0.6);

          /* ---- Cards: clip wipe, then their contents ---- */
          q("[data-le-card]").forEach((card, i) => {
            gsap
              .timeline({
                scrollTrigger: { trigger: card, start: "top 85%" },
                delay: wide ? i * 0.15 : 0,
              })
              .fromTo(
                card,
                { clipPath: "inset(100% 0% 0% 0% round 28px)", y: 60 },
                {
                  clipPath: "inset(0% 0% 0% 0% round 28px)",
                  y: 0,
                  duration: 1.2,
                  ease: "expo.out",
                  clearProps: "clipPath,transform",
                },
              )
              .from(card.querySelectorAll("[data-le-map]"), { scale: 1.15, duration: 1.4, ease: "expo.out" }, 0)
              .from(
                card.querySelectorAll("[data-le-item]"),
                { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", stagger: 0.08 },
                0.4,
              );
          });

          /* ---- Map pin bounce ---- */
          gsap.from(q("[data-le-pin]"), {
            y: -40,
            opacity: 0,
            duration: 0.9,
            ease: "bounce.out",
            scrollTrigger: { trigger: q("[data-le-pin]")[0], start: "top 80%" },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="location"
      className="relative overflow-hidden bg-paper py-20 text-navy-900 sm:py-24 lg:py-20 xl:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* ---- Split header ---- */}
        <div className="grid items-end gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:mb-6 sm:gap-4 sm:text-[13px] md:text-[14px] md:tracking-[0.32em]">
              <span data-le-eyebrow-line className="h-0.5 w-10 origin-left bg-brand-purple sm:w-12" />
              <span data-le-eyebrow-text>Location &amp; enquiry</span>
            </p>
            <h2
              data-le-title
              className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[52px] xl:text-[60px]"
            >
              <span data-le-words>Visit us or</span>{" "}
              <span
                data-le-accent
                className="inline-block pb-[0.08em] pr-[0.15em] font-serif font-semibold italic text-brand-purple"
              >
                send an enquiry
              </span>
            </h2>
          </div>
          <p
            data-le-fade
            className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:pl-6 sm:text-[18px] lg:col-span-4 lg:mb-3"
          >
            Meet our team at the Mirpur DOHS office, or leave your details and we&apos;ll call you back.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-12 lg:gap-6 xl:mt-16">
          {/* ---- Map + contact card ---- */}
          <div
            data-le-card
            className="flex flex-col overflow-hidden rounded-[28px] border border-navy-900/10 bg-white lg:col-span-6 xl:rounded-[32px]"
          >
            <div className="relative h-[280px] overflow-hidden sm:h-[340px] lg:h-auto lg:flex-1 lg:min-h-[300px]">
              <div data-le-map className="absolute inset-0">
                <iframe
                  title="Upayon Holdings office location"
                  src={siteConfig.mapEmbedSrc}
                  className="size-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <span
                data-le-pin
                className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-brand-purple px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-lg"
              >
                <MapPin className="size-3.5" aria-hidden="true" />
                Mirpur DOHS
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <ul className="space-y-4">
                {contacts.map(({ Icon, label, value, href, external }) => (
                  <li key={label} data-le-item>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-start gap-4"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-purple/10 text-brand-purple transition-colors duration-300 group-hover:bg-brand-purple group-hover:text-white">
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 pt-0.5">
                        <span className="block text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          {label}
                        </span>
                        <span className="mt-0.5 block break-words text-[16px] font-semibold leading-snug text-navy-900 transition-colors group-hover:text-brand-purple sm:text-[17px]">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <a
                data-le-item
                href={siteConfig.mapDirectionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-purple px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.1em] text-brand-purple transition-colors duration-300 hover:bg-brand-purple hover:text-white sm:w-fit"
              >
                <Navigation className="size-4" aria-hidden="true" />
                Get directions
              </a>
            </div>
          </div>

          {/* ---- Enquiry form card ---- */}
          <div
            data-le-card
            className="rounded-[28px] border border-navy-900/10 bg-white p-6 shadow-[0_30px_60px_-35px_rgba(123,76,168,0.45)] sm:p-9 lg:col-span-6 xl:rounded-[32px] xl:p-11"
          >
            <div data-le-item className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[30px]">
                  Send an enquiry
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                  Tell us what you&apos;re looking for and our team will get back to you.
                </p>
              </div>
              <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-brand-purple text-white sm:grid">
                <Mail className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
            <div data-le-item>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
