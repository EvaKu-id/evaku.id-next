"use client";

import { useMemo, useState } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { MapFrame } from "@/components/ui/map-frame";
import { Segmented } from "@/components/ui/segmented";
import { useManifest, useReplayEval, useRunRoads } from "@/hooks/use-data";
import { formatNumber, formatPercent } from "@/lib/format";
import { REPLAY_COLORS } from "@/lib/palette";
import type { VillageFill } from "@/types/map";

type View = "compare" | "predicted" | "observed";

const LEGEND = [
  { key: "tp", label: "Tepat: diprediksi dan terjadi", color: REPLAY_COLORS.tp },
  { key: "fp", label: "Alarm palsu: diprediksi, tidak terjadi", color: REPLAY_COLORS.fp },
  { key: "fn", label: "Terlewat: terjadi, tidak diprediksi", color: REPLAY_COLORS.fn },
] as const;

export function ReplayMap() {
  const [view, setView] = useState<View>("compare");
  const evaluation = useReplayEval();
  const manifest = useManifest();
  const radarRun = manifest.data?.radar_runs[0]?.run_id ?? null;
  const forecastRun = manifest.data?.forecast_runs.find((run) => run.horizon_hours === 72)?.run_id ?? null;
  const roads = useRunRoads(view === "predicted" ? forecastRun : radarRun);

  const fills = useMemo<VillageFill[]>(
    () =>
      (evaluation.data ?? []).map((row) => {
        if (view === "compare") return { village_id: row.village_id, status: "reachable", category: row.category };
        const flagged = view === "predicted" ? row.predicted : row.observed;
        return { village_id: row.village_id, status: flagged ? "fully_isolated" : "reachable" };
      }),
    [evaluation.data, view],
  );

  const counts = useMemo(() => {
    const result = { tp: 0, fp: 0, fn: 0, tn: 0 };
    for (const row of evaluation.data ?? []) result[row.category] += 1;
    return result;
  }, [evaluation.data]);
  const precision = counts.tp + counts.fp > 0 ? counts.tp / (counts.tp + counts.fp) : 0;
  const recall = counts.tp + counts.fn > 0 ? counts.tp / (counts.tp + counts.fn) : 0;

  return (
    <div className="grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <MapFrame
        title="Prediksi H−3 dibanding hari H"
        toolbar={
          <Segmented
            label="Tampilan"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "compare", label: "Bandingkan" },
              { value: "predicted", label: "H−3" },
              { value: "observed", label: "Hari H" },
            ]}
          />
        }
        bodyClassName="h-[380px] sm:h-[460px]"
      >
        {manifest.data ? (
          <LazyMapCanvas
            initialBounds={manifest.data.region.bbox}
            villages={fills}
            villageMode={view === "compare" ? "category" : "status"}
            roads={roads.data ?? []}
            layers={{ places: false, route: false, flood: false }}
            cooperativeGestures
            label="Peta evaluasi replay"
          />
        ) : null}
      </MapFrame>
      <div className="space-y-5">
        <ul className="space-y-2">
          {LEGEND.map((item) => (
            <li key={item.key} className="flex items-center gap-3 rounded-[10px] border border-rule bg-surface px-3 py-2.5">
              <span aria-hidden className="size-3.5 rounded-[3px]" style={{ backgroundColor: item.color }} />
              <span className="flex-1 text-sm text-ink-2">{item.label}</span>
              <span className="font-data text-lg font-semibold text-ink">{formatNumber(counts[item.key])}</span>
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-[12px] border border-rule bg-surface p-4">
            <dt className="text-sm text-ink-2">Presisi desa terputus</dt>
            <dd className="font-data text-3xl font-semibold text-ink">{formatPercent(precision)}</dd>
          </div>
          <div className="rounded-[12px] border border-rule bg-surface p-4">
            <dt className="text-sm text-ink-2">Desa terputus yang tertangkap</dt>
            <dd className="font-data text-3xl font-semibold text-ink">{formatPercent(recall)}</dd>
          </div>
        </dl>
        <p className="text-sm leading-relaxed text-ink-2">
          Prakiraan 72 jam yang terbit tiga hari sebelum puncak banjir dibandingkan dengan status keterjangkauan desa
          dari citra radar hari H. {formatNumber(counts.tp + counts.fn)} desa benar-benar terputus.
        </p>
      </div>
    </div>
  );
}
