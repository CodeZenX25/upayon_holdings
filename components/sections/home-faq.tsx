import Link from "next/link";
import { Plus } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SectionTitle } from "@/components/sections/section-title";
import { siteConfig } from "@/lib/site-config";

/**
 * Plain-text answers to common buyer questions. Uses native <details> (no JS),
 * and the same text is sent to Google as FAQPage structured data.
 * Keep answers factual — update them if company terms change.
 */
const faqs = [
  {
    q: "What is land share in Dhaka?",
    a: "Land share means you buy a portion of a plot of land together with other owners. Each owner holds a registered share of the land, and the building is developed on it. It lets you own land in a prime Dhaka location for a fraction of the cost of buying a whole plot.",
  },
  {
    q: "What is the difference between land share and flat share?",
    a: "With land share you own a portion of the land itself. With flat share you buy a finished or under-construction apartment, together with its proportionate share of the land. Flat share suits families who want a ready home; land share suits buyers planning a long-term investment.",
  },
  {
    q: "Can I buy a flat in Dhaka on instalments?",
    a: "Yes. Upayon Holdings offers flexible instalment plans on its projects, so you can pay for your flat or land share over the construction period instead of in one payment. Contact our team for the payment schedule of a specific project.",
  },
  {
    q: "Which areas of Dhaka do you have projects in?",
    a: "Our real estate projects are in Mirpur DOHS, Bashundhara, Uttara and Purbachal. See the Projects page for ongoing, upcoming and completed buildings with location, size and handover details.",
  },
  {
    q: "Can I buy a ready flat or only under-construction apartments?",
    a: "Both. We list ready flats in completed buildings as well as under-construction and upcoming apartments in Dhaka. Under-construction flats usually come with a longer instalment period.",
  },
  {
    q: "How do I visit a project or your office?",
    a: `Call us at ${siteConfig.phone} or send an enquiry and we will arrange a site visit. Our office is at House-342, Road-5, Avenue 3, Mirpur DOHS, Dhaka 1216.`,
  },
];

export function HomeFaq() {
  return (
    <section className="mx-auto max-w-[1000px] px-5 py-24 md:px-8 md:py-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <SectionTitle
        eyebrow="FAQ"
        title={
          <>
            Buying flats &amp; land share in <span className="text-brand-purple">Dhaka</span>
          </>
        }
        description="Answers to the questions buyers ask us most about land share, flat share and apartments for sale in Dhaka."
      />

      <div data-reveal-stagger className="mt-12 space-y-3 md:mt-14">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl bg-white ring-1 ring-slate-200 transition open:ring-brand-purple/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-[17px] font-semibold text-navy-900 md:text-[18px] [&::-webkit-details-marker]:hidden">
              <h3>{q}</h3>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple transition group-open:rotate-45">
                <Plus className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="px-6 pb-6 text-[16px] leading-[1.8] text-slate-600">{a}</p>
          </details>
        ))}
      </div>

      <p data-reveal className="mt-10 text-center text-[16px] text-slate-600">
        Have another question?{" "}
        <Link href="/contact" className="font-semibold text-brand-purple hover:underline">
          Talk to our team
        </Link>
      </p>
    </section>
  );
}
