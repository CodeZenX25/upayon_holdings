import { Clock3, ShieldCheck, Wallet } from "lucide-react";
import { SectionTitle } from "@/components/sections/section-title";

const features = [
  {
    Icon: Clock3,
    title: "On-time handover",
    text: "We work with tech-savvy engineers and planners so every milestone is tracked — and your keys arrive on the promised date.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality construction",
    text: "Premium materials, structural audits at every stage, and finishing that exceeds industry standards for lasting value.",
  },
  {
    Icon: Wallet,
    title: "Secure payments",
    text: "Transparent, milestone-based instalments with verified documentation — no hidden costs, ever.",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 size-[420px] rounded-full bg-navy-600/40 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionTitle
          tone="dark"
          eyebrow="Why Upayon"
          title={
            <>
              Features that we are{" "}
              <span className="font-serif font-semibold italic text-gold">
                super proud of
              </span>
            </>
          }
          description="Institutional standards, ethical ownership, and uncompromising build quality — in every single project."
        />

        <div data-reveal-stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map(({ Icon, title, text }, i) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-[30px] bg-white p-9 text-center text-navy-900 transition duration-500 hover:-translate-y-2"
            >
              <span className="absolute right-6 top-4 font-serif text-[64px] italic leading-none text-navy-900/5">
                0{i + 1}
              </span>
              <span className="mx-auto grid size-[72px] place-items-center rounded-[22px] bg-navy-900 text-gold transition duration-500 group-hover:rotate-[8deg] group-hover:bg-gold group-hover:text-navy-950">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-7 text-[22px] font-extrabold">{title}</h3>
              <p className="mt-3 text-[16px] leading-[1.85] text-slate-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
