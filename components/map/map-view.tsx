"use client";

import { useTheme } from "next-themes";
import {
  Activity,
  Layers3,
  MapPin,
  Maximize2,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { useMapLibre } from "@/hooks/use-maplibre";
import { useMapMarkers } from "@/hooks/use-map-markers";
import { DEFAULT_VIEW } from "@/lib/map-config";
import type {
  BasemapTheme,
  MapMarker,
  MapViewState,
} from "@/lib/types/map";

const DEFAULT_CLASS_NAME =
  "h-full min-h-[420px] w-full";

interface MapViewProps {
  initialView?: MapViewState;
  markers?: readonly MapMarker[];
  className?: string;
}

export function MapView({
  initialView = DEFAULT_VIEW,
  markers,
  className = DEFAULT_CLASS_NAME,
}: MapViewProps) {
  const { resolvedTheme } = useTheme();

  const theme: BasemapTheme =
    resolvedTheme === "dark" ? "dark" : "light";

  const { containerRef, map } = useMapLibre({
    initialView,
    theme,
  });

  useMapMarkers(map, markers);

  return (
    <section className="w-full space-y-4">
      {/* Map Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers3 size={19} />
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              Peta Monitoring
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Pantau kondisi wilayah dan lokasi kejadian secara
            interaktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Peta aktif
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck size={14} />
            Monitoring wilayah
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        {/* Map Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin size={16} className="text-blue-500" />
            Tampilan geografis
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity size={14} />
            {markers?.length ?? 0} titik lokasi
          </div>
        </div>

        {/* Actual Map */}
        <div className="relative">
          <div
            ref={containerRef}
            className={className}
            aria-label="Peta monitoring interaktif"
            role="region"
          />

          {/* Map Attribution / Context */}
          <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-lg border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm sm:flex">
            <Radio size={14} className="text-emerald-500" />
            <span className="text-muted-foreground">
              Peta interaktif
            </span>
          </div>
        </div>

        {/* Map Footer */}
        <div className="flex flex-col justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Layers3 size={14} />
            <span>
              Basemap: {theme === "dark" ? "Dark" : "Light"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Maximize2 size={14} />
            <span>Geser dan zoom untuk menjelajahi peta</span>
          </div>
        </div>
      </div>
    </section>
  );
}