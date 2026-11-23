import { Suspense } from "react";
import { BlogView } from "@/components/admin/blog/blog-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <BlogView />
    </Suspense>
  );
}
