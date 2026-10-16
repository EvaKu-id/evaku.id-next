"use client";

import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SourceNote } from "@/components/ui/source-note";
import { Stat } from "@/components/ui/stat";
import { useActiveRegions, useNationalFloods } from "@/hooks/use-data";
import { formatNumber } from "@/lib/format";
import type { ActiveRegion } from "@/types/data";

export function NationalPanel({ onOpenRegion }: { onOpenRegion: (region: ActiveRegion) => void }) {
  const floods = useNationalFloods();
  const regions = useActiveRegions();
  const top = [...(floods.data?.provinces ?? [])].sort((a, b) => b.floods - a.floods).slice(0, 10);
  const max = top[0]?.floods ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <p className="label-data">Indonesia · {floods.data?.year ?? 2024}</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">Kejadian banjir per provinsi</h2>
        {floods.data ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat value={floods.data.total_floods} label="kejadian banjir" tone="brand" />
            <Stat value={(floods.data.total_floods / floods.data.total_disasters) * 100} unit="%" label="dari semua bencana" />
          </div>
        ) : (
          <Skeleton className="mt-3 h-14" />
        )}
        <SourceNote className="mt-2">Sumber: {floods.data?.source ?? "BNPB"}</SourceNote>
      </div>

      <section>
        <h3 className="label-data mb-2">Wilayah aktif</h3>
        {(regions.data ?? []).map((region) => (
          <div key={region.region_id} className="rounded-[12px] border border-brand/30 bg-brand-soft p-3">
            <p className="flex items-center gap-1.5 font-semibold text-ink">
              <MapPin className="size-4 text-brand" aria-hidden /> {region.name}
            </p>
            <p className="mt-0.5 text-xs text-ink-2">
              {region.province} · {formatNumber(region.villages)} desa · {formatNumber(region.road_km)} km jalan ·{" "}
              {formatNumber(region.population)} warga
            </p>
            <Button size="sm" className="mt-3" onClick={() => onOpenRegion(region)}>
              Buka wilayah <ArrowRight />
            </Button>
          </div>
        ))}
      </section>

      <section>
        <h3 className="label-data mb-2">10 provinsi terbanyak</h3>
        <ol className="space-y-2">
          {top.map((province) => (
            <li key={province.pcode} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="truncate text-ink">{province.name}</span>
                <span className="font-data text-ink">{formatNumber(province.floods)}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-water-3" style={{ width: `${(province.floods / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
