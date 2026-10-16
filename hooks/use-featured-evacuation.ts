"use client";

import { useQueries } from "@tanstack/react-query";
import { useManifest, useRunVillages } from "@/hooks/use-data";
import { dataSource } from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import type { Evacuation, RunVillage } from "@/types/data";

const CANDIDATES = 6;

export interface FeaturedEvacuation {
  village: RunVillage;
  site: Evacuation;
  runTime: string;
}

// The highest-probability village that actually has a recommended site, for the home page examples.
export function useFeaturedEvacuation(): FeaturedEvacuation | null {
  const manifest = useManifest();
  const run = manifest.data?.forecast_runs.find((r) => r.horizon_hours === 72);
  const villages = useRunVillages(run?.run_id ?? null);
  const ranked = [...(villages.data ?? [])]
    .filter((v) => v.cutoff_hour !== null && (v.probability ?? 0) >= 0.7)
    .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
    .slice(0, CANDIDATES);
  const details = useQueries({
    queries: ranked.map((village) => ({
      queryKey: queryKeys.village(village.village_id, run?.run_id ?? ""),
      queryFn: () => dataSource.village(village.village_id, run?.run_id ?? ""),
      enabled: run !== undefined,
    })),
  });
  if (!run) return null;
  for (let i = 0; i < ranked.length; i += 1) {
    const site = details[i]?.data?.run.evacuations?.[0];
    if (site) return { village: ranked[i], site, runTime: run.data_time };
  }
  return null;
}
