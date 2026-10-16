"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { VillageStatusBadge } from "@/components/ui/status";
import { cn } from "@/lib/cn";
import { formatDecimal, formatNumber, formatPercent } from "@/lib/format";
import type { RankedVillage } from "@/lib/ranking";
import { SCORE_LABELS, scoredComponents, type ScoreWeights } from "@/lib/scoring";

interface RankingTableProps {
  maxHeight?: boolean;
  rows: readonly RankedVillage[];
  weights: ScoreWeights;
  selectedId: string | null;
  onSelect: (villageId: string) => void;
  limit?: number;
  compact?: boolean;
}

export function RankingTable({ rows, weights, selectedId, onSelect, limit, compact = false, maxHeight = false }: RankingTableProps) {
  const shown = limit ? rows.slice(0, limit) : rows;
  const components = scoredComponents(rows.map((row) => row.score_breakdown));
  if (rows.length === 0) {
    return <EmptyState title="Tidak ada desa terisolasi">Semua desa masih terjangkau dari posko.</EmptyState>;
  }
  return (
    <div className={cn("overflow-x-auto rounded-[12px] border border-rule bg-surface", maxHeight && "max-h-[640px] overflow-y-auto")} data-lenis-prevent>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-surface-2 text-left">
          <tr className="border-b border-rule">
            <th scope="col" className="label-data w-10 px-3 py-2 text-right">#</th>
            <th scope="col" className="label-data px-3 py-2">Desa</th>
            <th scope="col" className="label-data px-3 py-2">Status</th>
            <th scope="col" className="label-data px-3 py-2 text-right">Warga</th>
            {compact ? null : (
              <>
                <th scope="col" className="label-data px-3 py-2 text-right">Balita</th>
                <th scope="col" className="label-data px-3 py-2 text-right">Lansia</th>
                {components.map((component) => (
                  <th key={component} scope="col" className="label-data hidden px-2 py-2 xl:table-cell" title={SCORE_LABELS[component]}>
                    {SCORE_LABELS[component].split(" ")[0]} <span className="text-brand">{formatPercent(weights[component])}</span>
                  </th>
                ))}
              </>
            )}
            <th scope="col" className="label-data px-3 py-2 text-right">Skor</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => {
            const parts = new Map((row.score_breakdown ?? []).map((item) => [item.component, item.value]));
            return (
              <tr
                key={row.village_id}
                onClick={() => onSelect(row.village_id)}
                className={cn("cursor-pointer border-b border-rule last:border-0 hover:bg-surface-2", selectedId === row.village_id && "bg-brand-soft")}
              >
                <td className="px-3 py-2 text-right font-data text-muted">{row.rank}</td>
                <td className="px-3 py-2">
                  <button type="button" className="text-left font-semibold text-ink hover:text-brand" onClick={() => onSelect(row.village_id)}>
                    {row.name}
                  </button>
                  <p className="text-xs text-muted">Kec. {row.district}</p>
                </td>
                <td className="px-3 py-2"><VillageStatusBadge status={row.status} /></td>
                <td className="px-3 py-2 text-right font-data">{formatNumber(row.isolated_population)}</td>
                {compact ? null : (
                  <>
                    <td className="px-3 py-2 text-right font-data">{formatNumber(row.children_under5)}</td>
                    <td className="px-3 py-2 text-right font-data">{formatNumber(row.elderly)}</td>
                    {components.map((component) => (
                      <td key={component} className="hidden px-2 py-2 xl:table-cell">
                        <div className="h-1.5 w-14 rounded-full bg-surface-3" title={formatDecimal((parts.get(component) ?? 0) * 100)}>
                          <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round((parts.get(component) ?? 0) * 100)}%` }} />
                        </div>
                      </td>
                    ))}
                  </>
                )}
                <td className="px-3 py-2 text-right font-data font-semibold text-ink">{formatDecimal(row.score * 100)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
