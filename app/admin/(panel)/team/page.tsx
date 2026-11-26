import { Suspense } from "react";
import { TeamView } from "@/components/admin/team/team-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <TeamView />
    </Suspense>
  );
}
