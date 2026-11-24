import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectView } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { SectionTitle } from "@/components/sections/section-title";

export function LatestProjects({ projects }: { projects: ProjectView[] }) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionTitle
          eyebrow="Our portfolio"
          title={
            <>
              Discover the latest projects{" "}
              <span className="text-brand-purple">available today</span>
            </>
          }
          description="Your dreams are our passion — we build unique, quality projects for families who value trust."
        />

        {projects.length > 0 ? (
          <div data-reveal-stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p data-reveal className="mt-14 text-center text-[17px] text-slate-500">
            New projects are coming soon.
          </p>
        )}

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-8 py-3.5 text-[14px] font-semibold uppercase tracking-[0.08em] text-navy-900 transition hover:border-brand-purple hover:bg-brand-purple hover:text-white"
          >
            See all projects
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
