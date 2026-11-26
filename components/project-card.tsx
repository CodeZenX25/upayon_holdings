import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Layers,
  Maximize2,
  MapPin,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { ProjectView } from "@/lib/projects";
import { availabilityLabel, formatHandover, specLabel, statusLabel } from "@/lib/project-labels";

function cardSpecs(project: ProjectView): { Icon: LucideIcon; label: string }[] {
  const specs: { Icon: LucideIcon; label: string }[] = [];
  if (project.bedrooms) specs.push({ Icon: BedDouble, label: specLabel(project.bedrooms, "Beds") });
  if (project.bathrooms) specs.push({ Icon: Bath, label: specLabel(project.bathrooms, "Baths") });
  if (project.projectArea) specs.push({ Icon: Maximize2, label: project.projectArea });
  if (project.verandahs) specs.push({ Icon: Sun, label: specLabel(project.verandahs, "Verandahs") });
  if (project.parking) specs.push({ Icon: Car, label: specLabel(project.parking, "Parking") });
  if (project.floors) specs.push({ Icon: Building2, label: specLabel(project.floors, "Floors") });
  if (project.landArea) specs.push({ Icon: Layers, label: project.landArea });
  if (project.handoverDate) {
    specs.push({ Icon: CalendarDays, label: formatHandover(project.handoverDate) });
  }
  specs.splice(5);
  specs.push({ Icon: CheckCircle2, label: availabilityLabel[project.availability] });
  return specs;
}

export function ProjectCard({ project }: { project: ProjectView }) {
  const specs = cardSpecs(project);
  const mobileSpecs = specs.filter((s) => s.Icon !== CheckCircle2).slice(0, 3);

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title}`}
      className="group relative block h-[440px] overflow-hidden rounded-[28px] bg-navy-900 shadow-[0_25px_50px_-30px_rgba(17,20,58,0.6)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_35px_60px_-30px_rgba(17,20,58,0.7)] sm:h-[500px] lg:h-[540px]"
    >
      <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-110 md:group-hover:blur-[3px]"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition duration-500 md:group-hover:opacity-0" />

      <div className="pointer-events-none absolute right-0 top-0 z-10 size-32 overflow-hidden">
        <span className="absolute right-[-46px] top-[28px] w-[180px] rotate-45 bg-brand-purple py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
          {statusLabel[project.status]}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 transition duration-500 md:p-7 md:group-hover:translate-y-4 md:group-hover:opacity-0">
        <h3 className="text-[24px] font-bold uppercase leading-tight tracking-tight text-white drop-shadow-sm md:text-[28px]">
          {project.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-[15px] font-medium text-white/90">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{project.location}</span>
        </p>
        {mobileSpecs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 md:hidden">
            {mobileSpecs.map(({ Icon, label }, i) => (
              <span
                key={`${i}-${label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/25 backdrop-blur"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 hidden items-center bg-navy-950/45 px-6 opacity-0 transition duration-500 group-hover:opacity-100 md:flex lg:px-8">
        <div className="grid w-full grid-cols-2 gap-3">
          {specs.map(({ Icon, label }, i) => (
            <span
              key={`${i}-${label}`}
              className="flex translate-y-4 flex-col items-center justify-center gap-2 rounded-2xl bg-white/95 px-2 py-5 text-center text-[14px] font-semibold text-navy-900 opacity-0 shadow-sm transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              style={{ transitionDelay: `${60 + i * 60}ms` }}
            >
              <Icon className="size-5 text-brand-purple" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
