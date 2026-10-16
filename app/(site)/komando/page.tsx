import type { Metadata } from "next";
import { Suspense } from "react";
import { KomandoApp } from "@/components/komando/komando-app";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Ruang komando",
  description: "Ranking desa prioritas, rincian skor, ringkasan dampak, dan laporan situasi untuk posko.",
};

function Fallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-24" />
      <Skeleton className="h-96" />
    </div>
  );
}

export default function KomandoPage() {
  return (
    <main id="konten">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <p className="label-data">Ruang komando · wilayah aktif</p>
        <h1 className="mt-2 max-w-2xl text-h2 text-ink">Desa mana yang ditangani lebih dulu</h1>
      </div>
      <Suspense fallback={<Fallback />}>
        <KomandoApp />
      </Suspense>
    </main>
  );
}
