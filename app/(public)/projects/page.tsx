import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { ProjectFilters } from "@/components/project-filters";
import { projects } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Our Projects | Upayon Holdings",
  description:
    "Explore ongoing, upcoming, and completed land-share and flat-share projects from Upayon Holdings in Dhaka.",
};

const filters: { label: string; value: string }[] = [
  { label: "All projects", value: "all" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; type?: string; location?: string }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { status, type, location } = await searchParams;
  const activeStatus = filters.some((filter) => filter.value === status)
    ? (status ?? "all")
    : "all";
  const activeType =
    type === "land-share" || type === "flat-share" ? type : "all";
  const activeLocation =
    location &&
    ["Bashundhara", "Uttara", "Purbachal", "Aftabnagar"].includes(location)
      ? location
      : "all";
  const visibleProjects = projects.filter((project) => {
    const matchesStatus =
      activeStatus === "all" || project.status === activeStatus;
    const matchesType = activeType === "all" || project.type === activeType;
    const matchesLocation =
      activeLocation === "all" || project.location.includes(activeLocation);
    return matchesStatus && matchesType && matchesLocation;
  });

  return (
    <>
      <section className="page-hero page-hero-projects">
        <div className="page-container">
          <p className="eyebrow eyebrow-light">Thoughtful places to begin</p>
          <h1>Explore our projects.</h1>
          <p>
            From a place to call home to a land-share opportunity, find out
            what&apos;s taking shape across Dhaka.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Projects
          </div>
        </div>
      </section>

      <section className="listing-section section-padding">
        <div className="page-container">
          <div className="listing-toolbar">
            <div className="filter-tabs" aria-label="Filter projects by status">
              {filters.map((filter) => {
                const query = new URLSearchParams();
                if (filter.value !== "all") query.set("status", filter.value);
                if (activeType !== "all") query.set("type", activeType);
                if (activeLocation !== "all") {
                  query.set("location", activeLocation);
                }
                const href = query.size ? `/projects?${query}` : "/projects";
                return (
                  <Link
                    className={
                      activeStatus === filter.value
                        ? "filter-tab is-active"
                        : "filter-tab"
                    }
                    href={href}
                    key={filter.value}
                    aria-current={
                      activeStatus === filter.value ? "page" : undefined
                    }
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
            <ProjectFilters
              activeStatus={activeStatus}
              activeType={activeType}
              activeLocation={activeLocation}
            />
          </div>
          <p className="listing-count">
            Showing <strong>{visibleProjects.length}</strong>{" "}
            {visibleProjects.length === 1 ? "project" : "projects"}
          </p>
          {visibleProjects.length ? (
            <div className="project-grid project-grid-listing">
              {visibleProjects.map((project) => (
                <ProjectCard project={project} key={project.slug} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No projects match these filters yet.</h2>
              <p>Try viewing all projects or ask our team what is coming next.</p>
              <Link className="button button-dark" href="/contact">
                Ask our team <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}
          <div className="project-disclaimer">
            Project information and imagery are illustrative previews. Contact
            our team for approved plans, current availability, and verified
            documents.
          </div>
        </div>
      </section>
    </>
  );
}
