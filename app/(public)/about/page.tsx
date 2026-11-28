import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TeamSection } from "@/components/sections/team-section";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "About Us — Real Estate Company in Dhaka",
  description:
    "Meet Upayon Holdings, a Dhaka real estate developer offering land share, flat share and apartments, led by an experienced leadership team in Mirpur DOHS.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: <ShieldCheck size={23} aria-hidden="true" />,
    title: "Honesty in every conversation",
    body: "Clear answers and straightforward information help people make decisions with confidence.",
  },
  {
    icon: <Compass size={23} aria-hidden="true" />,
    title: "Purpose in every plan",
    body: "We consider how a place works in daily life, from its layout to its connection with the neighborhood.",
  },
  {
    icon: <HeartHandshake size={23} aria-hidden="true" />,
    title: "People at the center",
    body: "A home is personal. We listen first and help each family explore options that fit their needs.",
  },
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <section className="page-hero page-hero-about">
        <div className="page-container">
          <p className="eyebrow eyebrow-light">Who we are</p>
          <h1>Better places begin with understanding.</h1>
          <p>
            We bring people and possibilities together through thoughtful
            residential projects in Dhaka.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            About us
          </div>
        </div>
      </section>

      {/* Our story — text only: heading left, story right */}
      <section className="bg-white py-20 text-navy-900 sm:py-24 xl:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="mb-5 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.28em] text-brand-purple sm:text-[13px] md:text-[14px]">
              <span aria-hidden="true" className="h-0.5 w-10 bg-brand-purple sm:w-12" />
              Our story
            </p>
            <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-[38px] sm:text-[48px] lg:text-[52px]">
              A more personal way to{" "}
              <span className="font-serif font-semibold italic text-brand-purple">find your place.</span>
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-12">
            <div className="space-y-5 border-l-2 border-brand-purple pl-5 text-[17px] leading-[1.8] text-slate-600 sm:pl-7 sm:text-[18px]">
              <p className="text-[19px] font-medium leading-[1.7] text-navy-900 sm:text-[21px]">
                Upayon Holdings is a Dhaka-based real estate company focused on land-share and flat-share
                opportunities.
              </p>
              <p>
                We believe the path to a home should feel considered, informed, and grounded in a real
                conversation.
              </p>
              <p>
                We bring care to the details that shape each project and take time to help people understand the
                options in front of them. From the first conversation to the next important step, our promise is to
                be approachable, thoughtful, and clear.
              </p>
            </div>
            <Link
              href="/projects"
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-brand-purple px-7 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-navy-900 sm:ml-7"
            >
              Discover our projects
              <ArrowUpRight
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <TeamSection members={team.members} />

      <section className="about-purpose-section section-padding">
        <div className="page-container">
          <SectionHeading
            eyebrow="What guides us"
            title="A good place is built on more than bricks."
            description="The principles we bring to our work are the same ones we bring to every conversation."
          />
          <div className="values-grid about-principles-grid">
            {principles.map((principle, index) => (
              <article className="value-card" key={principle.title}>
                <div className="value-card-top">
                  <span className="value-icon">{principle.icon}</span>
                  <span className="value-number">0{index + 1}</span>
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
                <span className="value-rule" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="page-container about-cta-inner">
          <div className="about-cta-icon">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <p className="eyebrow eyebrow-light">Here when you&apos;re ready</p>
          <h2>Let&apos;s talk about what home means to you.</h2>
          <p>
            Explore current opportunities or simply ask us a question. We&apos;re
            happy to help you find a place to begin.
          </p>
          <Link className="button button-lime" href="/contact">
            Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
