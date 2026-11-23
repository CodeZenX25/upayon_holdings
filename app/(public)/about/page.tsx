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

export const metadata: Metadata = {
  title: "About Us | Upayon Holdings",
  description:
    "Learn about Upayon Holdings and our considered approach to residential real estate in Dhaka.",
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

export default function AboutPage() {
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

      <section className="about-story section-padding">
        <div className="page-container about-story-grid">
          <div className="about-story-image" role="img" aria-label="Modern residential architecture surrounded by greenery" />
          <div className="about-story-copy">
            <p className="eyebrow">Our story</p>
            <h2>
              A more personal way
              <br />
              to find your place.
            </h2>
            <p>
              Upayon Holdings is a Dhaka-based real estate company focused on
              land-share and flat-share opportunities. We believe the path to a
              home should feel considered, informed, and grounded in a real
              conversation.
            </p>
            <p>
              We bring care to the details that shape each project and take
              time to help people understand the options in front of them.
              From the first conversation to the next important step, our
              promise is to be approachable, thoughtful, and clear.
            </p>
            <Link className="text-link" href="/projects">
              Discover our projects{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

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
