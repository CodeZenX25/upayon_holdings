import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicBlogPost } from "@/lib/public-data";

export function BlogCard({ post }: { post: PublicBlogPost }) {
  return (
    <article className="blog-card">
      <Link
        className="blog-card-image"
        href={`/blog/${post.slug}`}
        style={{ backgroundImage: `url("${post.coverImage}")` }}
        aria-label={`Read ${post.title}`}
      >
        <span className="blog-category">{post.category}</span>
      </Link>
      <div className="blog-card-body">
        <p className="blog-meta">
          {post.publishedAt} <span aria-hidden="true">·</span> 5 min read
        </p>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <Link className="text-link" href={`/blog/${post.slug}`}>
          Read the story <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
