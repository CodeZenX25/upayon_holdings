import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BedDouble, Building2, Layers, MapPin } from "lucide-react";
import type { PublicProject } from "@/lib/public-data";
import { SectionTitle } from "@/components/sections/section-title";

const statusLabel = {
  ongoing: "Ongoing",
  upcoming: "Upcoming",
  completed: "Completed",
} as const;

export function LatestProjects({ projects }: { projects: PublicProject[] }) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionTitle
          eyebrow="Our portfolio"
          title={
            <>
              Discover the latest projects{" "}
              <span className="font-serif font-semibold italic text-navy-600">
                available today
              </span>
            </>
          }
          description="Your dreams are our passion — we build unique, quality projects for families who value trust."
        />

        <div data-reveal-stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectTile key={project.slug} project={project} />
          ))}
        </div>

        <div data-reveal className="mt-14 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-navy-900 px-8 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            See all projects
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectTile({ project }: { project: PublicProject }) {
  const specs = [
    { Icon: Layers, label: project.landArea },
    { Icon: Building2, label: project.floors ? `${project.floors} floors` : "Plots" },
    { Icon: BedDouble, label: project.totalUnits ? `${project.totalUnits} units` : "Land share" },
  ];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block h-[520px] overflow-hidden rounded-[30px] bg-navy-900 text-white shadow-[0_30px_60px_-30px_rgba(17,20,58,0.6)]"
    >
      <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-[1.4s] ease-out group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,36,0)_30%,rgba(11,13,36,0.92)_100%)]" />

      <span className="absolute right-5 top-5 rounded-full bg-navy-950/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-md">
        {statusLabel[project.status]}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-7">
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-white/70">
          <MapPin className="size-3.5 text-gold" aria-hidden="true" />
          {project.location}
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h3 className="text-[28px] font-extrabold uppercase leading-tight tracking-tight">
            {project.title}
          </h3>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-navy-950 transition duration-500 group-hover:rotate-45">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </span>
        </div>
        <div className="grid max-h-0 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-5 group-hover:max-h-24 group-hover:opacity-100">
          {specs.map(({ Icon, label }) => (
            <span
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-center text-[12px] font-semibold backdrop-blur"
            >
              <Icon className="size-4 text-gold" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
