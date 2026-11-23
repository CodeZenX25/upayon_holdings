import { Suspense } from "react";
import { SettingsView } from "@/components/admin/settings/settings-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <SettingsView />
    </Suspense>
  );
}
