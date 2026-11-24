import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutIntro() {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
      <div className="lg:pt-2">
        <p
          data-reveal
          className="mb-5 inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-purple"
        >
          <span className="h-px w-8 bg-brand-purple" />
          Who we are
        </p>
        <h2
          data-split
          className="text-[36px] font-semibold leading-[1.15] tracking-tight text-navy-900 md:text-[52px] lg:text-[58px]"
        >
          Top Real Estate Company in{" "}
          <span className="text-brand-purple">Bangladesh</span>
        </h2>
      </div>

      <div data-reveal className="space-y-6 text-[16px] leading-[1.85] text-slate-600 md:text-[17px]">
        <p>
          Upayon Holdings Ltd. is a Dhaka-based real estate developer helping
          families and investors own property with confidence. Through land
          share and flat share ownership, we make quality homes in prime
          locations accessible without the usual complexity.
        </p>
        <p>
          Every project is built on careful planning, sound engineering and
          honest communication. From the first site visit to the final
          handover, we keep you informed and deliver what we promise — on time.
        </p>
        <p>
          Explore our ongoing, upcoming and completed projects to find the home
          or investment that fits your future. We are here to be your long-term
          partner in building it.
        </p>

        <div className="pt-3">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-8 py-3.5 text-[14px] font-semibold uppercase tracking-[0.08em] text-navy-900 transition hover:border-brand-purple hover:bg-brand-purple hover:text-white"
          >
            About us
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
