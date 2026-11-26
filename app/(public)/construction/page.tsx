import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, HardHat, Search } from "lucide-react";
import { ScrollStack } from "@/components/motion/scroll-stack";
import { ConstructionCard } from "@/components/construction/construction-card";
import { constructionStatusLabel, getConstructions } from "@/lib/constructions";
import type { ConstructionStatus } from "@/models";

export const metadata: Metadata = {
  title: "Construction | Upayon Holdings",
  description: "Buildings constructed by Upayon Holdings across Dhaka — ongoing, upcoming and completed.",
};

const statuses = Object.keys(constructionStatusLabel) as ConstructionStatus[];

interface ConstructionPageProps {
  searchParams: Promise<{ q?: string; location?: string; status?: string }>;
}

const fieldClass =
  "h-14 w-full rounded-full border border-navy-900/10 bg-white px-5 text-[15.5px] text-navy-900 outline-none transition focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/15";

export default async function ConstructionPage({ searchParams }: ConstructionPageProps) {
  const { q = "", location = "", status = "" } = await searchParams;
  const all = await getConstructions();

  const query = q.trim().toLowerCase();
  const activeStatus = statuses.includes(status as ConstructionStatus) ? (status as ConstructionStatus) : "";
  const locations = Array.from(new Set(all.map((c) => c.location))).sort();
  const activeLocation = locations.includes(location) ? location : "";

  const visible = all.filter((c) => {
    const matchesQuery =
      !query ||
      [c.title, c.location, c.address, c.projectCode].some((field) => field?.toLowerCase().includes(query));
    return (
      matchesQuery && (!activeStatus || c.status === activeStatus) && (!activeLocation || c.location === activeLocation)
    );
  });
  const filtered = Boolean(query || activeStatus || activeLocation);

  return (
    <ScrollStack>
      <div className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-12 md:px-8 md:pt-16">
          {/* ---- Header ---- */}
          <header className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:text-[13px] md:text-[14px]">
                <span aria-hidden="true" className="h-0.5 w-10 bg-brand-purple sm:w-12" />
                Construction
              </p>
              <h1
                data-split
                className="text-[38px] font-extrabold leading-[1.08] tracking-tight text-navy-900 sm:text-[52px] lg:text-[60px]"
              >
                Built with care, <span className="font-serif font-semibold italic text-brand-purple">floor by floor</span>
              </h1>
            </div>
            <p
              data-reveal
              className="max-w-xl border-l-2 border-brand-purple pl-5 text-[16px] leading-[1.75] text-slate-600 sm:text-[18px] lg:col-span-4 lg:mb-3"
            >
              From foundations to finishing — the buildings Upayon is constructing and has delivered across Dhaka.
            </p>
          </header>

          {all.length === 0 ? (
            /* ---- Nothing added yet: coming soon ---- */
            <div
              data-reveal
              className="mt-14 flex flex-col items-center rounded-[28px] border border-navy-900/10 bg-white px-6 py-16 text-center sm:py-20"
            >
              <span className="grid size-16 place-items-center rounded-2xl bg-brand-purple text-white">
                <HardHat className="size-8" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="mt-6 rounded-full bg-brand-purple/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-brand-purple">
                Upcoming
              </span>
              <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-navy-900 sm:text-[36px]">
                Our construction portfolio is coming soon
              </h2>
              <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-slate-600 sm:text-[17px]">
                We&apos;re preparing details of the buildings we&apos;re constructing. Talk to our team to learn about
                current work.
              </p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-purple px-7 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-navy-900"
              >
                Contact our team
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              {/* ---- Filters (plain GET form — works without JS) ---- */}
              <form
                data-reveal
                action="/construction"
                className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
                role="search"
              >
                <label className="relative block sm:col-span-2 lg:col-span-1">
                  <span className="sr-only">Search</span>
                  <Search className="absolute left-5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input name="q" defaultValue={q} placeholder="Type to search" className={`${fieldClass} pl-12`} />
                </label>
                <label className="relative block">
                  <span className="sr-only">Location</span>
                  <select name="location" defaultValue={activeLocation} className={`${fieldClass} cursor-pointer appearance-none pr-12`}>
                    <option value="">All locations</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                </label>
                <label className="relative block">
                  <span className="sr-only">Status</span>
                  <select name="status" defaultValue={activeStatus} className={`${fieldClass} cursor-pointer appearance-none pr-12`}>
                    <option value="">All status</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {constructionStatusLabel[s]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                </label>
                <button
                  type="submit"
                  className="h-14 rounded-full bg-brand-purple px-9 text-[14px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-navy-900 sm:col-span-2 lg:col-span-1"
                >
                  Filter
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-[15px] text-slate-600">
                <p>
                  Showing <strong className="text-navy-900">{visible.length}</strong>{" "}
                  {visible.length === 1 ? "construction" : "constructions"}
                </p>
                {filtered && (
                  <Link href="/construction" className="font-semibold text-brand-purple hover:underline">
                    Clear filters
                  </Link>
                )}
              </div>

              {visible.length > 0 ? (
                <div data-reveal-stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {visible.map((item, i) => (
                    <ConstructionCard key={item.id} item={item} priority={i < 3} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[28px] border border-navy-900/10 bg-white px-6 py-14 text-center">
                  <h2 className="text-[22px] font-extrabold text-navy-900">No constructions match these filters.</h2>
                  <p className="mt-2 text-slate-600">Try a different search, or view everything.</p>
                  <Link
                    href="/construction"
                    className="mt-6 inline-flex rounded-full border-2 border-brand-purple px-6 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
                  >
                    View all
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ScrollStack>
  );
}
