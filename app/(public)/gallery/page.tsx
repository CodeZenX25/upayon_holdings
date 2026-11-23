import type { Metadata } from "next";
import Link from "next/link";
import { galleryItems } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Gallery | Upayon Holdings",
  description:
    "Explore architectural inspiration and visual stories from Upayon Holdings.",
};

const categories = [
  { value: "all", label: "All moments" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "interior", label: "Interiors" },
  { value: "events", label: "Community" },
];

interface GalleryPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function GalleryPage({
  searchParams,
}: GalleryPageProps) {
  const { category } = await searchParams;
  const activeCategory = categories.some((item) => item.value === category)
    ? (category ?? "all")
    : "all";
  const items =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="page-hero page-hero-gallery">
        <div className="page-container">
          <p className="eyebrow eyebrow-light">A closer look</p>
          <h1>Spaces, stories, and the details between.</h1>
          <p>
            A visual collection inspired by thoughtful architecture and
            everyday living.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Gallery
          </div>
        </div>
      </section>

      <section className="listing-section section-padding">
        <div className="page-container">
          <nav className="filter-tabs gallery-filters" aria-label="Filter gallery">
            {categories.map((item) => (
              <Link
                key={item.value}
                className={
                  activeCategory === item.value
                    ? "filter-tab is-active"
                    : "filter-tab"
                }
                href={
                  item.value === "all"
                    ? "/gallery"
                    : `/gallery?category=${item.value}`
                }
                aria-current={
                  activeCategory === item.value ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="gallery-grid">
            {items.map((item, index) => (
              <figure
                className={`gallery-tile gallery-tile-${(index % 3) + 1}`}
                key={item.title}
              >
                <div
                  className="gallery-tile-image"
                  style={{ backgroundImage: `url("${item.image}")` }}
                  role="img"
                  aria-label={item.title}
                />
                <figcaption>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="project-disclaimer">
            Images are illustrative and may not depict current project
            specifications. Contact our team for official project materials.
          </p>
        </div>
      </section>
    </>
  );
}
