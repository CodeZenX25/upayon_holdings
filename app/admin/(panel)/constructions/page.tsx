import { Suspense } from "react";
import { ConstructionsView } from "@/components/admin/constructions/constructions-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminConstructionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ConstructionsView />
    </Suspense>
  );
}
