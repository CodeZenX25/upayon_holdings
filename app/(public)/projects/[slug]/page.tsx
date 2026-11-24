import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  Download,
  Home,
  Layers,
  LayoutGrid,
  MapPin,
  Maximize2,
  Sun,
  Trees,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ScrollStack } from "@/components/motion/scroll-stack";
import { ProjectCard } from "@/components/project-card";
import { ProjectEnquiryForm } from "@/components/projects/project-enquiry-form";
import { MediaGrid, ProjectMedia } from "@/components/projects/project-media";
import { getProjectBySlug, getProjects, type ProjectView } from "@/lib/projects";
import {
  availabilityLabel,
  categoryLabel,
  formatHandover,
  ownershipLabel,
  statusLabel,
} from "@/lib/project-labels";

export const revalidate = 300;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found | Upayon Holdings" };

  return {
    title: project.seo.metaTitle || `${project.title} | Upayon Holdings`,
    description: project.seo.metaDescription || project.shortDescription,
    openGraph: { images: [project.coverImage] },
  };
}

function isSafeMapEmbed(url?: string): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ["www.google.com", "maps.google.com"].includes(parsed.hostname) &&
      parsed.pathname.startsWith("/maps")
    );
  } catch {
    return false;
  }
}

function areaLabel(project: ProjectView) {
  return project.projectArea || project.flatSizes.join(", ") || project.landArea;
}

function quickSpecs(project: ProjectView) {
  const area = areaLabel(project);
  const specs: { Icon: LucideIcon; label: string }[] = [];
  if (project.bedrooms) specs.push({ Icon: BedDouble, label: `${project.bedrooms} Beds` });
  if (project.bathrooms) specs.push({ Icon: Bath, label: `${project.bathrooms} Baths` });
  if (area) specs.push({ Icon: Maximize2, label: area });
  if (project.verandahs) specs.push({ Icon: Sun, label: `${project.verandahs} Verandahs` });
  if (project.parking) specs.push({ Icon: Car, label: `${project.parking} Parking` });
  if (project.floors) specs.push({ Icon: Building2, label: `${project.floors} Floors` });
  if (project.lifts) specs.push({ Icon: Layers, label: `${project.lifts} Lifts` });
  return specs.slice(0, 6);
}

function detailRows(project: ProjectView) {
  const rows: [string, string | number | undefined][] = [
    ["Ownership", ownershipLabel[project.type]],
    ["Location", project.address || project.location],
    ["Building facing", project.facing],
    ["Total floors", project.floors],
    ["Units per floor", project.unitsPerFloor],
    ["Total apartments", project.totalUnits],
    ["Bedrooms", project.bedrooms],
    ["Bathrooms", project.bathrooms],
    ["Verandahs", project.verandahs],
    ["Lifts", project.lifts],
    ["Total parking", project.parking],
    ["Land area", project.landArea],
    ["Unit sizes", project.flatSizes.join(", ") || undefined],
  ];
  return rows.filter((row): row is [string, string | number] => row[1] !== undefined && row[1] !== "");
}

const amenityGroups: { key: keyof ProjectView["amenities"]; label: string; Icon: LucideIcon }[] = [
  { key: "interior", label: "Interior features", Icon: Home },
  { key: "outdoor", label: "Outdoor features", Icon: Trees },
  { key: "utilities", label: "Utilities", Icon: Zap },
  { key: "other", label: "Other features", Icon: LayoutGrid },
  { key: "nearby", label: "Nearby", Icon: MapPin },
];

function SectionBlock({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-slate-200 pt-12 md:pt-14">
      <h2 data-split className="text-[26px] font-semibold tracking-tight text-navy-900 md:text-[32px]">
        {title}
      </h2>
      <div className="mt-6 md:mt-8">{children}</div>
    </section>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getProjects()).filter((p) => p.id !== project.id).slice(0, 3);
  const area = areaLabel(project);
  const facts: { Icon: LucideIcon; label: string; value: string }[] = [
    { Icon: Building2, label: "Status", value: statusLabel[project.status] },
    { Icon: Home, label: "Project type", value: categoryLabel[project.category] },
    ...(area ? [{ Icon: Maximize2, label: "Project area", value: area }] : []),
    ...(project.handoverDate
      ? [{ Icon: CalendarDays, label: "Expected handover", value: formatHandover(project.handoverDate) }]
      : []),
    { Icon: CheckCircle2, label: "Availability", value: availabilityLabel[project.availability] },
  ];
  const specs = quickSpecs(project);
  const details = detailRows(project);
  const paragraphs = project.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const hasAmenities = amenityGroups.some(({ key }) => project.amenities[key].length > 0);
  const galleryImages = project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <ScrollStack>
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-10 md:px-8 md:pt-14">
        <header>
          <Link
            data-hero-item
            href="/projects"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-slate-500 transition hover:text-brand-purple"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All projects
          </Link>
          <p data-hero-item className="mt-6 flex items-center gap-2 text-[15px] font-medium text-navy-900">
            <MapPin className="size-[18px] text-brand-purple" aria-hidden="true" />
            {project.location}
          </p>
          <h1
            data-hero-item
            className="mt-3 text-[38px] font-semibold uppercase leading-[1.05] tracking-tight text-navy-900 sm:text-[52px] lg:text-[64px]"
          >
            {project.title}
          </h1>

          <dl
            data-hero-item
            className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 border-y border-slate-200 py-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-slate-200 text-brand-purple">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[13px] font-medium text-slate-500">{label}</dt>
                  <dd className="text-[16px] font-semibold text-navy-900">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <a
            href="#enquire"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-purple px-7 py-3.5 text-[15px] font-semibold text-white lg:hidden"
          >
            Request more information
          </a>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div className="min-w-0 space-y-12 md:space-y-14">
            <div className="relative h-[300px] overflow-hidden rounded-3xl bg-slate-200 sm:h-[440px] lg:h-[540px]">
              <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {specs.length > 0 && (
            <div data-reveal-stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {specs.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-paper px-3 py-6 text-center ring-1 ring-slate-200/70"
                >
                  <Icon className="size-6 text-brand-purple" aria-hidden="true" />
                  <span className="text-[15px] font-semibold text-navy-900">{label}</span>
                </div>
              ))}
            </div>
            )}

            <SectionBlock title="Project description">
              <div data-reveal className="space-y-5 text-[17px] leading-[1.85] text-slate-600">
                <p className="text-[18px] font-medium leading-relaxed text-navy-900">{project.shortDescription}</p>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </SectionBlock>

            {project.highlights.length > 0 && (
              <SectionBlock title="Project highlights">
                <ul data-reveal-stagger className="space-y-4">
                  {project.highlights.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <p className="text-[17px] leading-[1.75] text-slate-600">
                        <strong className="font-semibold text-navy-900">{item.title}:</strong> {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}

            {project.keyFeatures.length > 0 && (
              <SectionBlock title="Key features">
                <ul data-reveal-stagger className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3 text-[16px] leading-relaxed text-slate-700">
                      <span className="mt-[9px] size-2 shrink-0 rounded-full bg-brand-purple" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}

            {details.length > 0 && (
              <SectionBlock title="Details">
                <dl data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
                  {details.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 rounded-2xl bg-paper px-5 py-4 ring-1 ring-slate-200/70"
                    >
                      <dt className="text-[15px] text-slate-500">{label}</dt>
                      <dd className="text-right text-[16px] font-semibold text-navy-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </SectionBlock>
            )}

            {hasAmenities && (
              <SectionBlock title="Features & amenities">
                <div className="space-y-10">
                  {amenityGroups.map(({ key, label, Icon }) => {
                    const items = project.amenities[key];
                    if (items.length === 0) return null;
                    return (
                      <div key={key}>
                        <h3 className="flex items-center gap-3 text-[19px] font-semibold text-navy-900">
                          <span className="grid size-10 place-items-center rounded-full bg-brand-purple text-white">
                            <Icon className="size-[18px]" aria-hidden="true" />
                          </span>
                          {label}
                        </h3>
                        <ul data-reveal-stagger className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3">
                          {items.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-[15px] font-medium text-navy-900 ring-1 ring-slate-200 transition hover:ring-brand-purple/40"
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
                                <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </SectionBlock>
            )}

            {project.floorPlans.length > 0 && (
              <SectionBlock title="Floor plans">
                <MediaGrid
                  title={project.title}
                  items={project.floorPlans.map((plan) => ({
                    src: plan.image,
                    kind: "image" as const,
                    caption: plan.title,
                  }))}
                />
              </SectionBlock>
            )}

            <SectionBlock id="gallery" title="Gallery">
              <ProjectMedia title={project.title} images={galleryImages} videos={project.videos} />
            </SectionBlock>

            {isSafeMapEmbed(project.mapEmbedUrl) && (
              <SectionBlock title="Location">
                <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
                  <iframe
                    src={project.mapEmbedUrl}
                    title={`${project.title} location map`}
                    className="h-[320px] w-full md:h-[420px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                </div>
              </SectionBlock>
            )}
          </div>

          <aside id="enquire" className="scroll-mt-28">
            <div className="lg:sticky lg:top-28">
              <div data-reveal className="rounded-3xl bg-white p-6 shadow-[0_25px_60px_-30px_rgba(17,20,58,0.35)] ring-1 ring-slate-200 md:p-8">
                <h2 className="text-center text-[24px] font-semibold leading-tight text-navy-900">
                  Request more information
                </h2>
                <p className="mb-6 mt-2 text-center text-[15px] text-slate-500">
                  About {project.title}
                </p>
                <ProjectEnquiryForm
                  projectId={project.id}
                  projectTitle={project.title}
                  inquiryType={project.type}
                />
              </div>
              {project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-navy-900 transition hover:border-brand-purple hover:text-brand-purple"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download brochure
                </a>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24 border-t border-slate-200 pt-16 md:mt-28">
            <div className="flex items-end justify-between gap-6">
              <h2 data-split className="text-[28px] font-semibold tracking-tight text-navy-900 md:text-[40px]">
                You might also like
              </h2>
              <Link
                href="/projects"
                className="hidden shrink-0 text-[15px] font-semibold text-brand-purple hover:underline sm:inline"
              >
                View all projects
              </Link>
            </div>
            <div data-reveal-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ScrollStack>
  );
}
