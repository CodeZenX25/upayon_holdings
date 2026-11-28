import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CircleCheck,
  Download,
  FileText,
  Layers,
  MapPin,
  MapPinned,
  type LucideIcon,
} from "lucide-react";
import { ScrollStack } from "@/components/motion/scroll-stack";
import { MediaSlider } from "@/components/projects/project-media";
import { ProjectEnquiryForm } from "@/components/projects/project-enquiry-form";
import {
  constructionStatusLabel,
  constructionTypeLabel,
  getConstructionBySlug,
} from "@/lib/constructions";
import { brochureDownloadHref, brochureFileName, isUploadedBrochure } from "@/lib/brochure";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getConstructionBySlug(slug);
  if (!item) return { title: "Construction not found", robots: { index: false } };
  const description =
    item.description.slice(0, 155) ||
    `${item.title} — ${item.buildingHeight ? `${item.buildingHeight} ` : ""}building construction by Upayon Holdings in ${item.location}, Dhaka.`;
  return {
    title: `${item.title} — Construction in ${item.location}`,
    description,
    alternates: { canonical: `/construction/${item.slug}` },
    openGraph: { title: item.title, description, images: [item.coverImage] },
  };
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-navy-900/10 bg-white p-6 sm:p-9">
      <h2 data-split className="text-[24px] font-extrabold tracking-tight text-navy-900 sm:text-[28px]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function ConstructionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getConstructionBySlug(slug);
  if (!item) notFound();

  const info: { Icon: LucideIcon; label: string; value?: string }[] = [
    { Icon: FileText, label: "Project ID", value: item.projectCode },
    { Icon: CircleCheck, label: "Status", value: constructionStatusLabel[item.status] },
    { Icon: MapPin, label: "Location", value: item.location },
    { Icon: Building2, label: "Construction type", value: constructionTypeLabel[item.constructionType] },
    { Icon: Layers, label: "Building height", value: item.buildingHeight },
    { Icon: MapPinned, label: "Address", value: item.address },
  ];
  const paragraphs = item.description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const gallery = (item.images.length > 0 ? item.images : [item.coverImage]).map((src) => ({
    src,
    kind: "image" as const,
  }));

  return (
    <ScrollStack>
      <div className="bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-10 md:px-8 md:pt-14">
          {/* ---- Header ---- */}
          <header>
            <Link
              href="/construction"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-slate-500 transition hover:text-brand-purple"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All construction
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-purple px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white">
                {constructionStatusLabel[item.status]}
              </span>
              <span className="flex items-center gap-1.5 text-[15px] font-medium text-navy-900">
                <MapPin className="size-4 text-brand-purple" aria-hidden="true" />
                {item.location}
              </span>
            </div>
            <h1
              data-split
              className="mt-4 text-[34px] font-extrabold uppercase leading-[1.05] tracking-tight text-navy-900 sm:text-[48px] lg:text-[58px]"
            >
              {item.title}
            </h1>
            <a
              href="#enquire"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-purple px-7 py-3.5 text-[15px] font-semibold text-white lg:hidden"
            >
              Request more information
            </a>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
            <div className="min-w-0 space-y-8">
              {/* Cover */}
              <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-navy-900 sm:h-[440px] lg:h-[520px]">
                <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Description + brochure */}
              <Block title="Construction description">
                <div data-reveal className="space-y-4 text-[17px] leading-[1.8] text-slate-600">
                  {item.buildingHeight && (
                    <p className="text-[18px] font-semibold text-navy-900">Building height: {item.buildingHeight}</p>
                  )}
                  {paragraphs.map((p) => (
                    <p key={p} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                  {!item.buildingHeight && paragraphs.length === 0 && (
                    <p>Details for this construction will be added soon.</p>
                  )}
                </div>
                {item.brochureUrl && (
                  <a
                    href={brochureDownloadHref(item.brochureUrl, item.title)}
                    download={brochureFileName(item.title)}
                    target={isUploadedBrochure(item.brochureUrl) ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-brand-purple px-7 py-4 text-[13.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-navy-900"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download brochure
                  </a>
                )}
              </Block>

              {/* Info grid */}
              <Block title="Construction info">
                <dl data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
                  {info
                    .filter((row): row is { Icon: LucideIcon; label: string; value: string } => Boolean(row.value))
                    .map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-navy-900/5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
                          <dd className="mt-0.5 break-words text-[16px] font-bold text-navy-900">{value}</dd>
                        </div>
                      </div>
                    ))}
                </dl>
              </Block>

              {/* Media */}
              <Block title="Media">
                <MediaSlider title={item.title} items={gallery} />
              </Block>
            </div>

            {/* ---- Enquiry sidebar ---- */}
            <aside id="enquire" className="scroll-mt-28">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-[28px] bg-white p-6 shadow-[0_25px_60px_-30px_rgba(17,20,58,0.35)] ring-1 ring-navy-900/10 md:p-8">
                  <h2 className="text-center text-[24px] font-extrabold leading-tight text-navy-900">
                    Request more information
                  </h2>
                  <p className="mb-6 mt-2 text-center text-[15px] text-slate-500">About {item.title}</p>
                  <ProjectEnquiryForm projectTitle={item.title} inquiryType="general" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ScrollStack>
  );
}
