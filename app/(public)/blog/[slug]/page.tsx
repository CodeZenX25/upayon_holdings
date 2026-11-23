import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/lib/public-data";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  return post
    ? { title: `${post.title} | Upayon Holdings`, description: post.excerpt }
    : { title: "Story not found | Upayon Holdings" };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <>
      <section className="article-hero">
        <div
          className="article-hero-image"
          style={{ backgroundImage: `url("${post.coverImage}")` }}
          role="img"
          aria-label="Illustrative residential interior"
        />
        <div className="article-hero-overlay" />
        <div className="page-container article-hero-content">
          <Link className="back-link" href="/blog">
            <ArrowLeft size={15} aria-hidden="true" /> All insights
          </Link>
          <span className="blog-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-byline">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>
              <Clock3 size={14} aria-hidden="true" /> 5 min read
            </span>
          </div>
        </div>
      </section>

      <article className="article-body">
        <div className="article-copy">
          <p className="content-note">
            Editorial preview content. Please review company-specific and
            professional guidance before publication.
          </p>
          <p className="article-lede">{post.excerpt}</p>
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <aside className="article-note">
            <strong>A note from Upayon Holdings</strong>
            <p>
              This article is general information only and is not legal or
              financial advice. Project details vary; always review verified
              documents with an independent professional.
            </p>
          </aside>
          <Link className="text-link" href="/contact">
            Talk to our team about a project{" "}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>

      <section className="related-section section-padding">
        <div className="page-container">
          <div className="insights-header">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2>Related stories</h2>
            </div>
            <Link className="text-link" href="/blog">
              All insights <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="blog-grid">
            {relatedPosts.map((related) => (
              <BlogCard key={related.slug} post={related} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
