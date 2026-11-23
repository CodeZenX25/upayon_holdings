import { Suspense } from "react";
import { LeadsView } from "@/components/admin/leads/leads-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <LeadsView />
    </Suspense>
  );
}
