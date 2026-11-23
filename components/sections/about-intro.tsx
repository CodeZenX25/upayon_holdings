import Link from "next/link";
import { ArrowRight, Building, HardHat, Play, Smile, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: 15, label: "Years of excellence", Icon: Trophy },
  { value: 25, label: "Ongoing projects", Icon: HardHat, featured: true },
  { value: 35, label: "Completed projects", Icon: Building },
  { value: 850, label: "Happy families", Icon: Smile },
];

export function AboutIntro() {
  return (
    <section className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p
          data-reveal
          className="mb-4 inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.28em] text-navy-600"
        >
          <span className="h-px w-8 bg-navy-600" />
          Innovating the industry
        </p>
        <h2
          data-split
          className="text-[34px] font-extrabold leading-[1.12] text-navy-900 md:text-[52px]"
        >
          Top real estate developer in{" "}
          <span className="font-serif font-semibold italic text-navy-600">
            Bangladesh
          </span>
        </h2>
        <div data-reveal className="mt-7 space-y-5 text-[17px] leading-[1.9] text-slate-600">
          <p>
            Upayon Holdings Ltd. is redefining the urban landscape of Dhaka
            with world-class engineering, transparent land share co-ownership,
            and turnkey flat share solutions.
          </p>
          <p>
            From architectural perfection to sustainable materials, our mission
            is to empower families with permanent, verified home equity —
            delivered on time, every time.
          </p>
        </div>
        <div data-reveal className="mt-9 flex flex-wrap items-center gap-6">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-navy-700"
          >
            About us
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link href="/gallery" className="group inline-flex items-center gap-3 text-[15px] font-semibold text-navy-900">
            <span className="relative grid size-12 place-items-center rounded-full bg-gold/20 text-navy-900">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
              <Play className="relative size-4 fill-current" aria-hidden="true" />
            </span>
            Watch our brand story
          </Link>
        </div>
      </div>

      <div data-reveal-stagger className="grid grid-cols-2 gap-4 md:gap-5">
        {stats.map(({ value, label, Icon, featured }, i) => (
          <div
            key={label}
            className={cn(
              "group rounded-[28px] p-6 transition duration-500 hover:-translate-y-1.5 md:p-8",
              featured
                ? "bg-navy-900 text-white shadow-[0_30px_60px_-25px_rgba(26,29,85,0.7)]"
                : "bg-paper text-navy-900 ring-1 ring-slate-200/70 hover:bg-white hover:shadow-xl",
              // `top` (not translate) so the GSAP reveal can't override the offset.
              i % 2 === 1 && "relative md:top-8",
            )}
          >
            <span
              className={cn(
                "grid size-12 place-items-center rounded-2xl",
                featured ? "bg-gold text-navy-950" : "bg-white text-navy-600 shadow-sm",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-8 text-[44px] font-extrabold leading-none tracking-tight md:text-[54px]">
              <span data-count={value}>{value}</span>
              <span className={featured ? "text-gold" : "text-navy-600"}>+</span>
            </p>
            <p
              className={cn(
                "mt-3 text-[13px] font-bold uppercase tracking-[0.16em]",
                featured ? "text-white/70" : "text-slate-500",
              )}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
