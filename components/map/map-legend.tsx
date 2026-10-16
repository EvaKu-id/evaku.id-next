"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { ROAD_STATUS_COLORS, VILLAGE_STATUS_COLORS } from "@/lib/road-style";
import { LegendRow } from "./legend-row";

const CUT_DASH = "repeating-linear-gradient(90deg, transparent, transparent 3px, #fff 3px, #fff 6px)";

function RoadLegend() {
  return (
    <div className="space-y-2 text-[11px]">
      <LegendRow swatch={{ height: 2, backgroundColor: ROAD_STATUS_COLORS.safe }}>
        <strong className="text-foreground">Aman</strong> (≤30 cm)
      </LegendRow>
      <LegendRow swatch={{ height: 5, backgroundColor: ROAD_STATUS_COLORS.limited }}>
        <strong className="text-foreground">Terbatas</strong> (30–60 cm, hanya truk)
      </LegendRow>
      <LegendRow
        swatch={{ height: 6, backgroundColor: ROAD_STATUS_COLORS.cut, backgroundImage: CUT_DASH }}
      >
        <strong className="text-foreground">Putus</strong> (&gt;60 cm)
      </LegendRow>
      <LegendRow swatch={{ height: 5, backgroundColor: ROAD_STATUS_COLORS.unknown }}>
        <strong className="text-foreground">Belum diketahui</strong>
      </LegendRow>
      <p className="text-[10px] leading-tight text-muted-foreground">
        Jalan kecil tampil saat peta diperbesar.
      </p>
    </div>
  );
}

function VillageLegend() {
  return (
    <div className="space-y-2 text-[11px]">
      <LegendRow
        swatch={{ height: 12, borderRadius: 2, backgroundColor: `${VILLAGE_STATUS_COLORS.fully_isolated}55` }}
      >
        <strong className="text-foreground">Desa terisolasi total</strong>
      </LegendRow>
      <LegendRow
        swatch={{ height: 12, borderRadius: 2, backgroundColor: `${VILLAGE_STATUS_COLORS.partially_isolated}40` }}
      >
        <strong className="text-foreground">Desa terisolasi sebagian</strong>
      </LegendRow>
    </div>
  );
}

export function MapLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="absolute bottom-4 right-4 z-20 max-w-64 rounded-2xl border border-border bg-background/95 p-3.5 shadow-lg backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <ShieldAlert size={14} className="text-sky-500" />
          Kondisi Ruas &amp; Desa
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] text-muted-foreground underline hover:text-foreground"
        >
          {open ? "Sembunyikan" : "Buka"}
        </button>
      </div>

      {open && (
        <div className="space-y-3">
          <RoadLegend />
          <div className="border-t border-border/40 pt-2">
            <VillageLegend />
          </div>
        </div>
      )}
    </div>
  );
}
