import { Suspense } from "react";
import { BannersView } from "@/components/admin/banners/banners-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBannersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <BannersView />
    </Suspense>
  );
}
