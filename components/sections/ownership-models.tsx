import Link from "next/link";
import { ArrowRight, Check, KeyRound, LandPlot } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/sections/section-title";

const models = [
  {
    tag: "Cost-price advantage",
    title: "Land share co-ownership",
    Icon: LandPlot,
    text: "Co-own prime land in Bashundhara, Purbachal or Uttara directly registered in your name. Build together at cost price — saving up to 30% compared to market rates.",
    points: [
      "Direct title & mutation registered in your name",
      "Build at actual construction cost — no developer markup",
      "Transparent quarterly progress & expense reports",
    ],
    cta: "Discover land share",
    href: "/projects?type=land-share",
    dark: false,
  },
  {
    tag: "Turnkey convenience",
    title: "Flat share & turnkey condominiums",
    Icon: KeyRound,
    text: "Purchase an individual flat in a ready or under-construction building with flexible instalments, premium finishing and a smooth, hassle-free handover.",
    points: [
      "Flexible 12 – 36 month interest-free instalments",
      "Premium fittings with structural warranty",
      "Full developer warranty & after-sales service",
    ],
    cta: "Explore available flats",
    href: "/projects?type=flat-share",
    dark: true,
  },
];

export function OwnershipModels() {
  return (
    <section id="models" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
      <SectionTitle
        eyebrow="Smart ownership solutions"
        title={
          <>
            Explore construction &amp;{" "}
            <span className="font-serif font-semibold italic text-navy-600">
              real estate models
            </span>
          </>
        }
        description="Choose the ownership model that aligns with your family's investment goals."
      />

      <div data-reveal-stagger className="mt-16 grid gap-6 lg:grid-cols-2">
        {models.map(({ tag, title, Icon, text, points, cta, href, dark }) => (
          <article
            key={title}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-[32px] p-8 transition duration-500 hover:-translate-y-1.5 md:p-11",
              dark
                ? "bg-navy-900 text-white shadow-[0_40px_80px_-30px_rgba(17,20,58,0.7)]"
                : "bg-paper text-navy-900 ring-1 ring-slate-200",
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "absolute -right-6 -top-6 size-44 transition duration-700 group-hover:rotate-12",
                dark ? "text-white/[0.06]" : "text-navy-900/[0.05]",
              )}
            />
            <span
              className={cn(
                "w-fit rounded-full px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.2em]",
                dark ? "bg-gold text-navy-950" : "bg-navy-900 text-white",
              )}
            >
              {tag}
            </span>
            <h3 className="mt-6 text-[28px] font-extrabold leading-tight md:text-[34px]">
              {title}
            </h3>
            <p className={cn("mt-4 text-[16.5px] leading-[1.9]", dark ? "text-white/70" : "text-slate-600")}>
              {text}
            </p>
            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15.5px] font-medium">
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                      dark ? "bg-gold/20 text-gold" : "bg-navy-900/10 text-navy-700",
                    )}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={href}
              className={cn(
                "group/btn mt-10 inline-flex w-fit items-center gap-2 rounded-full px-7 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] transition",
                dark
                  ? "bg-white text-navy-900 hover:bg-gold"
                  : "bg-navy-900 text-white hover:bg-navy-700",
              )}
            >
              {cta}
              <ArrowRight className="size-4 transition group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
