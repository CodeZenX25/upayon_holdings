import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  MapPin,
  MoveUpRight,
} from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { projects, type PublicProject } from "@/lib/public-data";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return { title: "Project not found | Upayon Holdings" };

  return {
    title: `${project.title} | Upayon Holdings`,
    description: project.shortDescription,
  };
}

const statusLabel: Record<PublicProject["status"], string> = {
  ongoing: "In progress",
  upcoming: "Coming soon",
  completed: "Completed",
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <section
        className="detail-hero"
        style={{ backgroundImage: `url("${project.coverImage}")` }}
      >
        <div className="detail-hero-overlay" />
        <div className="page-container detail-hero-content">
          <Link className="back-link" href="/projects">
            <ArrowLeft size={15} aria-hidden="true" /> All projects
          </Link>
          <span className={`status-pill status-${project.status}`}>
            <span aria-hidden="true" />
            {statusLabel[project.status]}
          </span>
          <h1>{project.title}</h1>
          <p>
            <MapPin size={16} aria-hidden="true" />
            {project.location}
          </p>
          <span className="detail-image-note">
            Illustrative project imagery
          </span>
        </div>
      </section>

      <section className="detail-overview section-padding">
        <div className="page-container detail-overview-grid">
          <div className="detail-description">
            <p className="eyebrow">
              {project.type === "land-share" ? "Land-share" : "Flat-share"} ·{" "}
              {project.location}
            </p>
            <h2>{project.shortDescription}</h2>
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="detail-disclaimer">
              Illustrative preview content only. Confirm all project
              information, availability, and documents with our team and
              independent professionals before making a decision.
            </p>
            <Link className="button button-dark" href="/contact">
              Ask about this project{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <aside className="detail-facts">
            <p className="eyebrow">At a glance</p>
            <div className="fact-row">
              <span>Project type</span>
              <strong>
                {project.type === "land-share" ? "Land-share" : "Flat-share"}
              </strong>
            </div>
            <div className="fact-row">
              <span>Land area</span>
              <strong>{project.landArea}</strong>
            </div>
            <div className="fact-row">
              <span>Planned floors</span>
              <strong>{project.floors || "To be announced"}</strong>
            </div>
            <div className="fact-row">
              <span>Planned homes</span>
              <strong>{project.totalUnits || "To be announced"}</strong>
            </div>
            <div className="fact-row">
              <span>Orientation</span>
              <strong>{project.facing}</strong>
            </div>
            <div className="fact-row">
              <span>Indicative handover</span>
              <strong>{project.handoverDate}</strong>
            </div>
            <div className="fact-flat-sizes">
              <span>Apartment sizes</span>
              <div>
                {project.flatSizes.length ? (
                  project.flatSizes.map((size) => <span key={size}>{size}</span>)
                ) : (
                  <span>Details available on request</span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {project.status === "ongoing" ? (
        <section className="progress-section section-padding">
          <div className="page-container progress-grid">
            <div>
              <p className="eyebrow">Project progress</p>
              <h2>A look at what&apos;s taking shape.</h2>
              <p>
                Progress information is for preview only. Contact us for the
                latest verified construction update.
              </p>
            </div>
            <div className="progress-meter">
              <div className="progress-meter-label">
                <span>Reported progress</span>
                <strong>{project.progress}%</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Indicative project progress"
              >
                <span style={{ width: `${project.progress}%` }} />
              </div>
              <p>Illustrative sample · Confirm progress with our team</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="features-section section-padding">
        <div className="page-container">
          <SectionHeading
            eyebrow="Made for everyday life"
            title="Details designed around you."
            description="A selection of planned features to ask our team about."
          />
          <div className="feature-grid">
            {project.features.map((feature) => (
              <div className="feature-item" key={feature}>
                <span>
                  <Check size={16} aria-hidden="true" />
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-cta-section">
        <div className="page-container detail-cta-inner">
          <div>
            <p className="eyebrow eyebrow-light">Interested in {project.title}?</p>
            <h2>Let&apos;s talk through the details.</h2>
            <p>
              Get in touch to request current information and arrange a
              conversation with our team.
            </p>
          </div>
          <Link className="button button-lime" href="/contact">
            Enquire about this project{" "}
            <MoveUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="related-section section-padding">
        <div className="page-container">
          <SectionHeading
            eyebrow="Keep exploring"
            title="You might also like"
          />
          <div className="project-grid">
            {relatedProjects.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
