"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  HelpCircle,
  Layers3,
  MapPin,
  Maximize2,
  Radio,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";

import { useMapLibre } from "@/hooks/use-maplibre";
import { useMapMarkers } from "@/hooks/use-map-markers";
import { useRoadLayers, type SelectedRoadInfo } from "@/hooks/use-road-layers";
import { DEFAULT_VIEW } from "@/lib/map-config";
import type { RoadStatus } from "@/lib/schemas/roads";
import type {
  BasemapTheme,
  MapMarker,
  MapViewState,
} from "@/lib/types/map";

const DEFAULT_CLASS_NAME = "h-full min-h-[460px] w-full";

interface MapViewProps {
  initialView?: MapViewState;
  markers?: readonly MapMarker[];
  roads?: readonly RoadStatus[];
  className?: string;
  showLegend?: boolean;
  onSelectRoad?: (road: SelectedRoadInfo | null) => void;
}

const ROAD_STATUS_MAP: Record<
  number,
  { label: string; color: string; desc: string; icon: typeof CheckCircle2 }
> = {
  0: {
    label: "Aman",
    color: "bg-emerald-600 text-white dark:bg-emerald-500",
    desc: "Bebas genangan, aman untuk semua kendaraan",
    icon: CheckCircle2,
  },
  1: {
    label: "Terbatas",
    color: "bg-amber-600 text-white dark:bg-amber-500",
    desc: "Genangan rendah (<30 cm), hanya truk/kendaraan tinggi",
    icon: AlertTriangle,
  },
  2: {
    label: "Putus",
    color: "bg-rose-600 text-white dark:bg-rose-500",
    desc: "Terendam tinggi (≥30 cm) atau jembatan rusak",
    icon: Ban,
  },
  3: {
    label: "Belum Diketahui",
    color: "bg-slate-500 text-white dark:bg-slate-600",
    desc: "Belum ada laporan sensor atau tim lapangan",
    icon: HelpCircle,
  },
};

export function MapView({
  initialView = DEFAULT_VIEW,
  markers,
  roads,
  className = DEFAULT_CLASS_NAME,
  showLegend = true,
  onSelectRoad,
}: MapViewProps) {
  const { resolvedTheme } = useTheme();
  const [selectedRoad, setSelectedRoad] = useState<SelectedRoadInfo | null>(null);
  const [legendOpen, setLegendOpen] = useState(true);

  const theme: BasemapTheme = resolvedTheme === "dark" ? "dark" : "light";

  const { containerRef, map } = useMapLibre({
    initialView,
    theme,
  });

  // Tampilkan marker lokasi desa/posko
  useMapMarkers(map, markers);

  // Terapkan layer ruas jalan dan setFeatureState dinamis
  useRoadLayers({
    map,
    roads,
    onSelectRoad: (road) => {
      setSelectedRoad(road);
      onSelectRoad?.(road);
    },
  });

  const activeStatus =
    selectedRoad !== null
      ? ROAD_STATUS_MAP[selectedRoad.status] ?? ROAD_STATUS_MAP[3]
      : null;

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
              Peta Monitoring &amp; Akses Ruas Jalan
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Visualisasi status ruas jalan dan desa terdampak secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium bg-background/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>{roads && roads.length > 0 ? `${roads.length} Ruas Terpantau` : "Peta Aktif"}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground bg-background/80">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Kesiapsiagaan Evakuasi</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative overflow-hidden rounded-2xl border bg-background shadow-sm">
        {/* Map Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 bg-muted/20">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin size={16} className="text-blue-500" />
            <span>Kawasan Padang (Koto Tangah)</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-sky-500" />
              {markers?.length ?? 0} titik desa
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Radio size={14} className="text-emerald-500" />
              {roads?.length ?? 0} ruas jalan
            </span>
          </div>
        </div>

        {/* Actual Map Canvas */}
        <div className="relative">
          <div
            ref={containerRef}
            className={className}
            aria-label="Peta monitoring interaktif"
            role="region"
          />

          {/* Popup Detail Ruas Jalan saat Diklik (UI-05 requirement) */}
          {selectedRoad && activeStatus && (
            <div className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100%-2rem)] rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur-md transition-all">
              <div className="flex items-start justify-between gap-2 border-b pb-2.5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Edge ID: {selectedRoad.edge_id}
                  </span>
                  <h3 className="text-sm font-bold leading-tight mt-0.5">
                    {selectedRoad.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRoad(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Tutup detail ruas"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kondisi Akses:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${activeStatus.color}`}
                  >
                    <activeStatus.icon size={13} />
                    {activeStatus.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimasi Kedalaman:</span>
                  <span className="font-mono font-bold">
                    {selectedRoad.depth_cm !== null && selectedRoad.depth_cm > 0
                      ? `${selectedRoad.depth_cm} cm`
                      : "0 cm (Bebas Air)"}
                  </span>
                </div>

                <div className="rounded-xl bg-muted/50 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
                  {activeStatus.desc}
                </div>
              </div>
            </div>
          )}

          {/* Legenda Kondisi Ruas Jalan (Colorblind-Safe) (UI-05 requirement) */}
          {showLegend && (
            <div className="absolute bottom-4 right-4 z-20 max-w-64 rounded-2xl border border-border bg-background/95 p-3.5 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/60">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-sky-500" />
                  Kondisi Ruas Jalan
                </span>
                <button
                  type="button"
                  onClick={() => setLegendOpen((v) => !v)}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                >
                  {legendOpen ? "Sembunyikan" : "Buka"}
                </button>
              </div>

              {legendOpen && (
                <div className="space-y-2 text-[11px]">
                  {/* Status 0: Aman */}
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-6 rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0 shadow-xs" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Aman</strong> (0 cm, semua kendaraan)
                    </span>
                  </div>

                  {/* Status 1: Terbatas */}
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-6 rounded-full bg-amber-600 dark:bg-amber-500 shrink-0 shadow-xs" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Terbatas</strong> (&lt;30 cm, hanya truk)
                    </span>
                  </div>

                  {/* Status 2: Putus (Garis Putus-Putus) */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-6 shrink-0 rounded-xs bg-rose-600 dark:bg-rose-500 relative flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent, transparent 3px, #fff 3px, #fff 6px)",
                      }}
                    />
                    <span className="text-muted-foreground">
                      <strong className="text-rose-600 dark:text-rose-400">Putus</strong> (Garis putus-putus)
                    </span>
                  </div>

                  {/* Status 3: Belum diketahui */}
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-6 rounded-full bg-slate-500 dark:bg-slate-600 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Belum Diketahui</strong>
                    </span>
                  </div>

                  <p className="pt-1.5 text-[10px] text-muted-foreground border-t border-border/40 leading-tight">
                    *Pola garis putus-putus memudahkan pembedaan saat mode buta warna.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map Footer Bar */}
        <div className="flex flex-col justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center bg-muted/10">
          <div className="flex items-center gap-2">
            <Layers3 size={14} />
            <span>
              Basemap: {theme === "dark" ? "Dark Matter" : "Positron"} • MapLibre GL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Maximize2 size={14} />
            <span>Klik pada ruas jalan untuk memeriksa estimasi kedalaman air</span>
          </div>
        </div>
      </div>
    </section>
  );
}