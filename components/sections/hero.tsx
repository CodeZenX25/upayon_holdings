import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck, MapPin, Search, Sparkles } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=85";

const selectClass =
  "w-full appearance-none bg-transparent pr-6 text-[15px] font-semibold text-navy-900 outline-none";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy-950 pb-16 pt-32 text-white md:pb-20">
      <div data-hero-bg className="absolute inset-0 -z-20">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,13,36,0.82)_0%,rgba(17,20,58,0.55)_45%,rgba(11,13,36,0.92)_100%)]" />

      <div className="mx-auto w-full max-w-[1240px] px-5 text-center md:px-8">
        <p
          data-hero-item
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.24em] text-gold ring-1 ring-white/20 backdrop-blur"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Bangladesh&apos;s premier real estate developer
        </p>

        <h1
          data-hero-item
          className="mx-auto mt-7 max-w-4xl text-[42px] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-[58px] lg:text-[76px]"
        >
          Connecting people &amp; their{" "}
          <span className="font-serif font-semibold italic tracking-normal text-gradient-gold">
            dream home
          </span>{" "}
          perfectly
        </h1>

        <p
          data-hero-item
          className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.85] text-white/75 md:text-[19px]"
        >
          Quality projects &amp; services delivered on time and on budget.
          Upayon Holdings creates Dhaka&apos;s most trusted land share &amp;
          flat share ownership opportunities.
        </p>

        <div data-hero-item className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-navy-950 transition hover:-translate-y-0.5 hover:bg-[#e6c47d]"
          >
            Explore projects
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white hover:text-navy-900"
          >
            Book a consultation
          </Link>
        </div>

        <form
          data-hero-item
          action="/projects"
          method="get"
          className="mx-auto mt-14 grid max-w-5xl gap-2 rounded-[28px] bg-white p-3 text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] md:grid-cols-[1fr_1fr_1fr_auto] md:rounded-full md:p-2.5"
        >
          <SearchField icon={<MapPin className="size-4" />} label="Location">
            <select name="location" defaultValue="" className={selectClass}>
              <option value="">All Dhaka locations</option>
              <option value="Bashundhara">Bashundhara</option>
              <option value="Uttara">Uttara</option>
              <option value="Purbachal">Purbachal</option>
              <option value="Aftabnagar">Aftabnagar</option>
            </select>
          </SearchField>
          <SearchField icon={<Building2 className="size-4" />} label="Project type">
            <select name="type" defaultValue="" className={selectClass}>
              <option value="">All ownership types</option>
              <option value="land-share">Land share</option>
              <option value="flat-share">Flat share</option>
            </select>
          </SearchField>
          <SearchField icon={<CalendarCheck className="size-4" />} label="Status">
            <select name="status" defaultValue="" className={selectClass}>
              <option value="">All statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </SearchField>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-8 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-navy-700"
          >
            <Search className="size-4" aria-hidden="true" /> Search
          </button>
        </form>
      </div>
    </section>
  );
}

function SearchField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex cursor-pointer flex-col rounded-full px-5 py-2.5 transition hover:bg-paper md:border-r md:border-slate-200 md:last-of-type:border-0">
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        <span aria-hidden="true" className="text-navy-600">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}
