import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import type { PublicBlogPost } from "@/lib/public-data";
import { SectionTitle } from "@/components/sections/section-title";

export function BlogPreview({ posts }: { posts: PublicBlogPost[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle
          align="left"
          eyebrow="Market knowledge"
          title={
            <>
              Explore our{" "}
              <span className="font-serif font-semibold italic text-navy-600">blog</span>
            </>
          }
        />
        <Link
          data-reveal
          href="/blog"
          className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-bold uppercase tracking-[0.14em] text-navy-900"
        >
          <span className="border-b-2 border-gold pb-1">Read all articles</span>
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      <div data-reveal-stagger className="mt-14 grid gap-7 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-[260px] overflow-hidden rounded-[26px]">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-900 backdrop-blur">
                  {post.category}
                </span>
                <span className="absolute bottom-4 right-4 grid size-11 translate-y-3 place-items-center rounded-full bg-gold text-navy-950 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[13px] font-medium text-slate-400">
                <CalendarDays className="size-4" aria-hidden="true" />
                {post.publishedAt}
              </p>
              <h3 className="mt-2 text-[21px] font-extrabold leading-snug text-navy-900 transition group-hover:text-navy-600">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-[15.5px] leading-[1.8] text-slate-500">
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
