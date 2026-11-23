import { Suspense } from "react";
import { TestimonialsView } from "@/components/admin/testimonials/testimonials-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTestimonialsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <TestimonialsView />
    </Suspense>
  );
}
