"use client";

import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ProbabilityBadge, VillageStatusBadge } from "@/components/ui/status";
import { cn } from "@/lib/cn";
import { cutoffLabel } from "@/lib/forecast";
import { formatNumber } from "@/lib/format";
import type { MapMode, RunVillage } from "@/types/data";

interface VillageListProps {
  villages: readonly RunVillage[];
  mode: MapMode;
  selectedId: string | null;
  onSelect: (villageId: string) => void;
  limit?: number;
}

export function rankVillages(villages: readonly RunVillage[], mode: MapMode): RunVillage[] {
  if (mode === "prakiraan") {
    return villages
      .filter((v) => (v.probability ?? 0) >= 0.35 || v.cutoff_hour !== null)
      .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0) || (a.cutoff_hour ?? 999) - (b.cutoff_hour ?? 999));
  }
  return villages
    .filter((v) => v.status !== "reachable")
    .sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0) || b.isolated_population - a.isolated_population);
}

export function VillageList({ villages, mode, selectedId, onSelect, limit }: VillageListProps) {
  const ranked = rankVillages(villages, mode);
  const shown = limit ? ranked.slice(0, limit) : ranked;
  if (ranked.length === 0) {
    return (
      <EmptyState title={mode === "prakiraan" ? "Tidak ada desa yang diperkirakan terputus dalam 72 jam" : "Tidak ada desa terisolasi"}>
        Semua desa masih terjangkau dari posko.
      </EmptyState>
    );
  }
  return (
    <ol className="divide-y divide-rule">
      {shown.map((village, index) => (
        <li key={village.village_id}>
          <button
            type="button"
            onClick={() => onSelect(village.village_id)}
            aria-current={selectedId === village.village_id ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-3 px-1 py-2.5 text-left transition-colors hover:bg-surface-2",
              selectedId === village.village_id && "bg-brand-soft",
            )}
          >
            <span className="w-6 shrink-0 text-right font-data text-xs text-muted">{index + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{village.name}</span>
              <span className="block text-xs leading-snug text-muted">
                Kec. {village.district} ·{" "}
                {mode === "prakiraan" ? cutoffLabel(village.cutoff_hour) : `${formatNumber(village.isolated_population)} warga terisolasi`}
              </span>
            </span>
            {mode === "prakiraan" && village.probability !== null ? (
              <ProbabilityBadge probability={village.probability} />
            ) : (
              <VillageStatusBadge status={village.status} />
            )}
            <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
          </button>
        </li>
      ))}
    </ol>
  );
}
