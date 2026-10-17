import type { Metadata } from "next";
import { Suspense } from "react";
import { VillagePage } from "@/components/village/village-page";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export const metadata: Metadata = {
  title: "Detail desa",
  description: "Peluang banjir, dampak, titik evakuasi, dan rute bantuan untuk satu desa.",
};


export default function Page() {
  return (
    <main id="konten">
      <Suspense fallback={<PageSkeleton className="max-w-6xl py-12" blocks={["h-10 w-1/3", "h-[480px]"]} />}>
        <VillagePage />
      </Suspense>
    </main>
  );
}
