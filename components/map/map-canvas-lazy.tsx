"use client";

import dynamic from "next/dynamic";
import { Ornament } from "@/components/ui/ornament";

function MapPlaceholder() {
  return (
    <div className="relative size-full overflow-hidden bg-surface-2" aria-hidden>
      <Ornament name="contours" className="absolute inset-0 text-brand/15" />
      <div className="absolute inset-x-0 bottom-4 text-center label-data">Memuat peta…</div>
    </div>
  );
}

export const LazyMapCanvas = dynamic(() => import("@/components/map/map-canvas"), {
  ssr: false,
  loading: MapPlaceholder,
});
