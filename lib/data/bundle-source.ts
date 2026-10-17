import { z } from "zod";
import { fetchJson } from "@/lib/data/fetch-json";
import { DATA_BASE, NATIONAL_BASE, clampLevel, levelKey, routeLevel } from "@/lib/data/paths";
import {
  activeRegionSchema,
  evacuationSitesSchema,
  featureCollectionSchema,
  floodIndexSchema,
  forecastRowSchema,
  hubsSchema,
  manifestSchema,
  metricSchema,
  nationalFloodsSchema,
  replayEvalSchema,
  roadStatusSchema,
  runVillageSchema,
  simLevelSchema,
  simRoutesSchema,
  simulationSchema,
  villageFileSchema,
  villageStaticSchema,
} from "@/lib/data/schemas";
import { DataError } from "@/lib/data/fetch-json";
import type { DataSource } from "@/lib/data/source";

export const bundleSource: DataSource = {
  manifest: () => fetchJson(`${DATA_BASE}/manifest.json`, manifestSchema),
  roads: (runId) => fetchJson(`${DATA_BASE}/runs/${runId}/roads.json`, z.array(roadStatusSchema)),
  villages: (runId) =>
    fetchJson(`${DATA_BASE}/runs/${runId}/villages.json`, z.array(runVillageSchema)),
  forecasts: () => fetchJson(`${DATA_BASE}/forecasts.json`, z.array(forecastRowSchema)),

  async village(villageId, runId) {
    const file = await fetchJson(`${DATA_BASE}/villages/${villageId}.json`, villageFileSchema);
    const run = file.runs[runId];
    if (!run) throw new DataError("Data desa untuk waktu ini tidak ditemukan.", 404);
    return { ...villageStaticSchema.parse(file), run_id: runId, run };
  },

  async simulate({ waterLevelM, vehicle }, signal) {
    const result = await fetchJson(
      `${DATA_BASE}/sim/${vehicle}/${levelKey(waterLevelM)}.json`,
      simulationSchema,
      { signal },
    );
    return { ...result, water_level_m: clampLevel(waterLevelM) };
  },

  simLevels: () => fetchJson(`${DATA_BASE}/sim/levels.json`, z.array(simLevelSchema)),

  async route({ villageId, vehicle, waterLevelM }) {
    const level = routeLevel(waterLevelM);
    try {
      const file = await fetchJson(`${DATA_BASE}/sim/routes/${villageId}.json`, simRoutesSchema);
      const match = file.levels.find(
        (item) => item.vehicle === vehicle && Math.abs(item.water_level_m - level) < 1e-6,
      );
      return match?.route ?? null;
    } catch (error) {
      // Villages that never lose access have no route file.
      if (error instanceof DataError && error.status === 404) return null;
      throw error;
    }
  },

  metrics: () => fetchJson(`${DATA_BASE}/metrics.json`, z.array(metricSchema)),
  replayEval: () => fetchJson(`${DATA_BASE}/replay-eval.json`, z.array(replayEvalSchema)),
  floodIndex: () => fetchJson(`${DATA_BASE}/flood/index.json`, floodIndexSchema),
  floodImageUrl: (date) => `${DATA_BASE}/flood/${date}.png`,
  lowConfidence: () =>
    fetchJson(`${DATA_BASE}/flood/low-confidence.geojson`, featureCollectionSchema),
  evacuationSites: () =>
    fetchJson(`${DATA_BASE}/places/evacuation-sites.geojson`, evacuationSitesSchema),
  hubs: () => fetchJson(`${DATA_BASE}/places/hubs.geojson`, hubsSchema),
  provinces: () => fetchJson(`${NATIONAL_BASE}/provinces.geojson`, featureCollectionSchema),
  nationalFloods: () => fetchJson(`${NATIONAL_BASE}/floods-2024.json`, nationalFloodsSchema),
  activeRegions: () =>
    fetchJson(`${NATIONAL_BASE}/active-regions.json`, z.array(activeRegionSchema)),
};
