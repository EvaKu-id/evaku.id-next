import type { Metadata } from "next";
import { Suspense } from "react";
import { VillagePage } from "@/components/village/village-page";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Detail desa",
  description: "Peluang banjir, dampak, titik evakuasi, dan rute bantuan untuk satu desa.",
};

function Fallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-12 sm:px-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-[480px]" />
    </div>
  );
}

export default function Page() {
  return (
    <main id="konten">
      <Suspense fallback={<Fallback />}>
        <VillagePage />
      </Suspense>
    </main>
  );
}
