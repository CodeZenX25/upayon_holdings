import { Suspense } from "react";
import { GalleryView } from "@/components/admin/gallery/gallery-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <GalleryView />
    </Suspense>
  );
}
