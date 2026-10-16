import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportApp } from "@/components/komando/report-app";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Laporan situasi",
  description: "Laporan situasi banjir satu halaman siap cetak.",
};

export default function ReportPage() {
  return (
    <main id="konten">
      <h1 className="sr-only">Laporan situasi</h1>
      <Suspense fallback={<Skeleton className="mx-auto mt-10 h-[80vh] max-w-[210mm]" />}>
        <ReportApp />
      </Suspense>
    </main>
  );
}
