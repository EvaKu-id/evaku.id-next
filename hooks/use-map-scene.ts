"use client";

import { useMemo } from "react";
import type { FloodOverlay } from "@/hooks/use-flood-layer";
import {
  useFloodIndex,
  useManifest,
  useRunRoads,
  useRunVillages,
  useSimulation,
} from "@/hooks/use-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { dataSource } from "@/lib/data";
import { reclassifyRoads } from "@/lib/thresholds";
import { summarize, type RunSummary } from "@/lib/run-summary";
import { useSettings } from "@/lib/stores/settings";
import type { Horizon, Manifest, MapMode, RoadState, RunVillage, ResultSource, Vehicle } from "@/types/data";
import type { VillageFill } from "@/types/map";

export interface SceneParams {
  mode: MapMode;
  horizon: Horizon;
  date: string | null;
  level: number;
  vehicle: Vehicle;
}

export interface MapScene {
  manifest: Manifest | undefined;
  runId: string | null;
  runTime: string | null;
  villages: RunVillage[];
  fills: VillageFill[];
  roads: RoadState[];
  summary: RunSummary | null;
  flood: FloodOverlay | null;
  floodDate: string | null;
  source: ResultSource | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  retry: () => void;
}

const EMPTY_ROADS: RoadState[] = [];

export function useMapScene({ mode, horizon, date, level, vehicle }: SceneParams): MapScene {
  const manifestQuery = useManifest();
  const manifest = manifestQuery.data;
  const thresholds = useSettings((state) => state.thresholds);

  const forecastRun = manifest?.forecast_runs.find((run) => run.horizon_hours === horizon) ?? manifest?.forecast_runs.at(-1);
  const radarRun = manifest?.radar_runs.find((run) => run.date === date) ?? manifest?.radar_runs[0];
  const baseRunId = radarRun?.run_id ?? null;
  const runId = mode === "prakiraan" ? (forecastRun?.run_id ?? null) : mode === "radar" ? baseRunId : null;
  const runTime = mode === "prakiraan" ? (forecastRun?.data_time ?? null) : (radarRun?.data_time ?? null);

  const runRoads = useRunRoads(runId);
  // Simulation results carry only status; names and demographics come from a run file.
  const baseVillages = useRunVillages(mode === "simulasi" ? baseRunId : runId);
  const debouncedLevel = useDebouncedValue(level, 300);
  const simulation = useSimulation(debouncedLevel, vehicle, mode === "simulasi");
  const floodIndex = useFloodIndex();

  const villages = useMemo<RunVillage[]>(() => {
    const base = baseVillages.data ?? [];
    if (mode !== "simulasi") return base;
    const sim = new Map((simulation.data?.villages ?? []).map((v) => [v.village_id, v]));
    return base.map((village) => {
      const result = sim.get(village.village_id);
      return {
        ...village,
        status: result?.status ?? "reachable",
        isolated_population: result?.isolated_population ?? 0,
        flooded_population: 0,
        priority_score: result?.priority_score ?? null,
        score_breakdown: result?.score_breakdown ?? null,
        probability: null,
        cutoff_hour: null,
      };
    });
  }, [baseVillages.data, simulation.data, mode]);

  const rawRoads = mode === "simulasi" ? simulation.data?.roads : runRoads.data;
  const roads = useMemo(
    () => reclassifyRoads(rawRoads ?? EMPTY_ROADS, vehicle, thresholds),
    [rawRoads, vehicle, thresholds],
  );

  const fills = useMemo<VillageFill[]>(
    () =>
      villages.map((village) => ({
        village_id: village.village_id,
        status: village.status,
        probability: mode === "prakiraan" ? village.probability : null,
      })),
    [villages, mode],
  );

  const summary = useMemo(
    () => (villages.length > 0 ? summarize(villages, roads) : null),
    [villages, roads],
  );

  const floodEntry = floodIndex.data?.dates.find((entry) => entry.date === radarRun?.date) ?? floodIndex.data?.dates[0];
  const flood = useMemo<FloodOverlay | null>(() => {
    if (mode !== "radar" || !floodIndex.data || !floodEntry) return null;
    return { url: dataSource.floodImageUrl(floodEntry.date), coordinates: floodIndex.data.bounds };
  }, [mode, floodIndex.data, floodEntry]);

  const queries = [manifestQuery, mode === "simulasi" ? simulation : runRoads, baseVillages];
  const failed = queries.find((query) => query.isError);

  return {
    manifest,
    runId,
    runTime,
    villages,
    fills,
    roads,
    summary,
    flood,
    floodDate: floodEntry?.date ?? null,
    source: mode === "simulasi" ? (simulation.data?.source ?? null) : null,
    isLoading: queries.some((query) => query.isPending && query.fetchStatus !== "idle"),
    isFetching: queries.some((query) => query.isFetching) || debouncedLevel !== level,
    error: failed?.error ?? null,
    retry: () => queries.forEach((query) => void query.refetch()),
  };
}
