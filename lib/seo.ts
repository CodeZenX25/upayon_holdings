import { siteConfig } from "@/lib/site-config";

/**
 * SEO settings shared by metadata, sitemap, robots and structured data.
 * Set NEXT_PUBLIC_SITE_URL to the live domain (e.g. https://upayonholdings.com)
 * in production so canonical URLs, sitemap and social previews point there.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const seo = {
  name: "Upayon Holdings",
  shortName: "Upayon Holdings",
  defaultTitle: "Upayon Holdings | Land Share, Flat Share & Apartments in Dhaka",
  description:
    "Upayon Holdings is a Dhaka real estate company offering land share, flat share and ready & under-construction apartments in Mirpur DOHS, Bashundhara, Uttara and Purbachal — with flexible instalment plans.",
  /** Default social preview image (1600×1600 render of an Upayon building). */
  ogImage: "/images/showcase/front-view.jpg",
  /**
   * Real-estate search terms (English + Bangla). Google ignores the keywords
   * meta tag, but Bing/Yandex read it; the same phrases are also used in page
   * titles, descriptions and headings, which is what search engines rank on.
   */
  keywords: [
    "Upayon Holdings",
    "Upayon Group",
    "real estate Dhaka",
    "real estate company in Dhaka",
    "real estate developer Bangladesh",
    "land share Dhaka",
    "flat share Dhaka",
    "apartment for sale in Dhaka",
    "flat for sale in Dhaka",
    "buy flat in Dhaka",
    "ready flat Dhaka",
    "under construction apartment Dhaka",
    "flat on installment Dhaka",
    "land for sale Dhaka",
    "plot for sale Dhaka",
    "residential apartment Dhaka",
    "property in Dhaka",
    "Mirpur DOHS flat",
    "Mirpur DOHS real estate",
    "Bashundhara apartment",
    "Uttara flat for sale",
    "Purbachal plot",
    "joint venture land development Dhaka",
    "building construction company Dhaka",
    "construction company Bangladesh",
    "ঢাকায় ফ্ল্যাট বিক্রি",
    "ঢাকায় জমি বিক্রি",
    "ল্যান্ড শেয়ার",
    "ফ্ল্যাট শেয়ার",
    "রিয়েল এস্টেট কোম্পানি ঢাকা",
    "অ্যাপার্টমেন্ট বিক্রয়",
    "প্লট বিক্রি",
    "কিস্তিতে ফ্ল্যাট",
  ],
};

/** Turns a site path (or an absolute URL) into an absolute URL. */
export function absoluteUrl(pathOrUrl: string) {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** BreadcrumbList JSON-LD — lets Google show "Home › Projects › Nirvana" in results. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** JSON-LD for one real-estate project (apartment building or land-share plot). */
export function projectJsonLd(project: {
  title: string;
  slug: string;
  type: string;
  location: string;
  address?: string;
  description: string;
  images: string[];
  floors?: number | string;
  totalUnits?: number | string;
}) {
  const isLand = project.type === "land-share";
  return {
    "@context": "https://schema.org",
    "@type": isLand ? "Place" : "ApartmentComplex",
    "@id": `${absoluteUrl(`/projects/${project.slug}`)}#project`,
    name: project.title,
    url: absoluteUrl(`/projects/${project.slug}`),
    description: project.description,
    image: project.images.map(absoluteUrl),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.address || project.location,
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    ...(!isLand && project.totalUnits ? { numberOfAccommodationUnits: project.totalUnits } : {}),
    ...(!isLand && project.floors
      ? { additionalProperty: { "@type": "PropertyValue", name: "Floors", value: project.floors } }
      : {}),
    containedInPlace: { "@type": "City", name: "Dhaka" },
    provider: { "@id": `${siteUrl}/#organization` },
  };
}

/** BlogPosting JSON-LD for an article. */
export function articleJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
}) {
  const published = new Date(post.publishedAt);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.coverImage)],
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(Number.isNaN(published.getTime()) ? {} : { datePublished: published.toISOString() }),
    author: { "@type": "Organization", name: post.author || seo.name },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

/** JSON-LD describing the business (shown to Google as a local real-estate company). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": `${siteUrl}/#organization`,
        name: seo.name,
        alternateName: ["Upayon Holdings", "Upayon Group"],
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        image: `${siteUrl}${seo.ogImage}`,
        description: seo.description,
        telephone: siteConfig.phoneHref.replace("tel:", ""),
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "House-342, Road-5, Avenue 3, Mirpur DOHS",
          addressLocality: "Dhaka",
          postalCode: "1216",
          addressCountry: "BD",
        },
        geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
        hasMap: siteConfig.mapDirectionsHref,
        areaServed: [
          { "@type": "City", name: "Dhaka" },
          { "@type": "Country", name: "Bangladesh" },
        ],
        knowsAbout: ["Land share", "Flat share", "Apartments", "Residential construction", "Real estate in Dhaka"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: seo.shortName,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}
