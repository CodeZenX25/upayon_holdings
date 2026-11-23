import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { PublicProject } from "@/lib/public-data";

const statusLabel = {
  ongoing: "In progress",
  upcoming: "Coming soon",
  completed: "Completed",
} as const;

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="project-card">
      <Link
        className="project-card-image"
        href={`/projects/${project.slug}`}
        style={{ backgroundImage: `url("${project.coverImage}")` }}
        aria-label={`View ${project.title} project`}
      >
        <span className={`status-pill status-${project.status}`}>
          <span aria-hidden="true" />
          {statusLabel[project.status]}
        </span>
        <span className="project-image-arrow" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="project-card-body">
        <div className="project-card-kicker">
          <span>{project.type === "land-share" ? "Land share" : "Flat share"}</span>
          <span>{project.handoverDate}</span>
        </div>
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="project-location">
          <MapPin size={14} aria-hidden="true" />
          {project.location}
        </p>
        <p className="project-card-description">{project.shortDescription}</p>
        <div className="project-card-meta">
          <span>{project.landArea}</span>
          {project.totalUnits > 0 ? (
            <span>{project.totalUnits} planned homes</span>
          ) : (
            <span>Residential plots</span>
          )}
        </div>
      </div>
    </article>
  );
}
