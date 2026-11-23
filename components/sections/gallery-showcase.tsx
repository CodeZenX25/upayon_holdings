import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicGalleryItem } from "@/lib/public-data";
import { cn } from "@/lib/utils";

export function GalleryShowcase({ items }: { items: PublicGalleryItem[] }) {
  return (
    <section className="overflow-hidden bg-white py-24 md:py-32">
      <div className="text-center">
        <p
          data-marquee
          className="whitespace-nowrap text-[44px] font-extrabold uppercase leading-none tracking-[0.06em] text-navy-900 md:text-[88px]"
        >
          We make the ordinary…
        </p>
        <p
          data-marquee="reverse"
          className="mt-2 whitespace-nowrap font-serif text-[48px] font-semibold uppercase italic leading-none tracking-[0.04em] text-navy-600 md:text-[96px]"
        >
          Extraordinary!
        </p>
        <p data-reveal className="mx-auto mt-6 max-w-xl px-5 text-[17px] leading-[1.85] text-slate-500">
          A curated look at architecture, interiors and moments from the
          Upayon portfolio.
        </p>
      </div>

      <div
        data-reveal-stagger
        className="mx-auto mt-16 grid max-w-[1320px] grid-cols-2 gap-4 px-5 md:grid-cols-4 md:gap-5 md:px-8"
      >
        {items.map((item, i) => (
          <figure
            key={item.title}
            className={cn(
              "group relative h-[280px] overflow-hidden rounded-[26px] md:h-[420px]",
              i % 2 === 1 && "md:mt-14",
            )}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition duration-[1.4s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(11,13,36,0.85)_100%)]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {item.category}
              </span>
              <span className="mt-1 block text-[16px] font-bold leading-snug">{item.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div data-reveal className="mt-14 text-center">
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.14em] text-navy-900"
        >
          <span className="border-b-2 border-gold pb-1">View full portfolio gallery</span>
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
