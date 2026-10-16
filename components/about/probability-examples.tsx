"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProbabilityChips } from "@/components/village/probability-chips";
import { useForecasts, useManifest, useRunVillages } from "@/hooks/use-data";

// Three real villages that show how the three horizons differ: one high, one rising, one low.
export function ProbabilityExamples() {
  const forecasts = useForecasts();
  const manifest = useManifest();
  const run = manifest.data?.forecast_runs.find((r) => r.horizon_hours === 72)?.run_id ?? null;
  const villages = useRunVillages(run);

  const examples = useMemo(() => {
    const list = villages.data ?? [];
    if (list.length === 0) return [];
    const sorted = [...list].sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0));
    const rising = sorted.find((v) => (v.probability ?? 0) >= 0.35 && (v.probability ?? 0) < 0.7);
    return [sorted[0], rising, sorted[sorted.length - 1]].filter((v) => v !== undefined);
  }, [villages.data]);

  if (examples.length === 0 || !forecasts.data) return <Skeleton className="h-48" />;
  return (
    <ul className="space-y-3">
      {examples.map((village) => (
        <li key={village.village_id}>
          <p className="mb-1.5 text-sm font-semibold text-ink">
            {village.name} <span className="font-normal text-muted">· Kec. {village.district}</span>
          </p>
          <ProbabilityChips rows={forecasts.data.filter((row) => row.village_id === village.village_id)} />
        </li>
      ))}
    </ul>
  );
}
