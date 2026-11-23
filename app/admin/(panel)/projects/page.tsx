import { Suspense } from "react";
import { ProjectsView } from "@/components/admin/projects/projects-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ProjectsView />
    </Suspense>
  );
}
