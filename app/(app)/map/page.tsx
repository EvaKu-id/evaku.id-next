import type { Metadata } from "next";
import { Suspense } from "react";
import { MapApp } from "@/components/map/map-app";

export const metadata: Metadata = {
  title: "Peta",
  description: "Peluang banjir per desa, genangan radar, status jalan, dan simulasi tinggi air.",
};

function MapFallback() {
  return <div className="h-[calc(100dvh-4rem)] w-full animate-pulse bg-surface-2" aria-hidden />;
}

export default function MapPage() {
  return (
    <main id="konten">
      <h1 className="sr-only">Peta EvaKu</h1>
      <Suspense fallback={<MapFallback />}>
        <MapApp />
      </Suspense>
    </main>
  );
}
