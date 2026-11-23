import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Insights & Guides | Upayon Holdings",
  description:
    "Ideas and practical guides to help you make more informed property decisions in Dhaka.",
};

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts;

  return (
    <>
      <section className="page-hero page-hero-blog">
        <div className="page-container">
          <p className="eyebrow eyebrow-light">Ideas for your next chapter</p>
          <h1>Good decisions start with good information.</h1>
          <p>
            Explore thoughtful perspectives and practical guides for your
            property journey.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Insights
          </div>
        </div>
      </section>

      <section className="listing-section section-padding">
        <div className="page-container">
          {featuredPost ? (
            <article className="featured-article">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="featured-article-image"
                style={{ backgroundImage: `url("${featuredPost.coverImage}")` }}
                aria-label={`Read ${featuredPost.title}`}
              >
                <span className="blog-category">{featuredPost.category}</span>
              </Link>
              <div className="featured-article-copy">
                <p className="eyebrow">Featured story</p>
                <p className="blog-meta">
                  {featuredPost.publishedAt} <span aria-hidden="true">·</span>{" "}
                  By {featuredPost.author}
                </p>
                <h2>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p>{featuredPost.excerpt}</p>
                <Link
                  className="button button-dark"
                  href={`/blog/${featuredPost.slug}`}
                >
                  Read the guide <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ) : null}
          <p className="content-note">
            Article content is an editorial preview. Please have company and
            professional guidance reviewed before publication.
          </p>
          <div className="insights-header blog-list-heading">
            <div>
              <p className="eyebrow">Explore our library</p>
              <h2>More to discover</h2>
            </div>
            <span className="article-count">
              <BookOpen size={15} aria-hidden="true" />
              {otherPosts.length} stories
            </span>
          </div>
          <div className="blog-grid">
            {otherPosts.map((post) => (
              <BlogCard post={post} key={post.slug} />
            ))}
          </div>
          <div className="blog-contact-note">
            <p>Have a question about a project or property decision?</p>
            <Link className="text-link" href="/contact">
              Ask our team <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
