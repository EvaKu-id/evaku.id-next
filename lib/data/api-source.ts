import { z } from "zod";
import { bundleSource } from "@/lib/data/bundle-source";
import { fetchJson } from "@/lib/data/fetch-json";
import {
  forecastRowSchema,
  manifestSchema,
  metricSchema,
  replayEvalSchema,
  roadStatusSchema,
  routeSchema,
  runVillageSchema,
  simulationSchema,
  villageFileSchema,
} from "@/lib/data/schemas";
import type { DataSource } from "@/lib/data/source";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function api(path: string): string {
  return `${API_BASE}/api${path}`;
}

const villageDetailSchema = villageFileSchema
  .omit({ runs: true })
  .extend({ run_id: z.string(), run: villageFileSchema.shape.runs.valueType });

// Run results and model calls come from the backend; map assets (flood images, places, national
// layers) stay as versioned files, exactly as in production.
export const apiSource: DataSource = {
  ...bundleSource,
  manifest: () => fetchJson(api("/manifest"), manifestSchema),
  roads: (runId) => fetchJson(api(`/runs/${runId}/roads`), z.array(roadStatusSchema)),
  villages: (runId) => fetchJson(api(`/runs/${runId}/villages`), z.array(runVillageSchema)),
  forecasts: () => fetchJson(api("/forecasts"), z.array(forecastRowSchema)),
  village: (villageId, runId) =>
    fetchJson(api(`/villages/${villageId}?run=${encodeURIComponent(runId)}`), villageDetailSchema),
  simulate: ({ waterLevelM, vehicle }, signal) =>
    fetchJson(api("/simulation"), simulationSchema, {
      method: "POST",
      body: { river_id: "tamiang", water_level_m: waterLevelM, vehicle },
      signal,
    }),
  route: ({ villageId, vehicle, waterLevelM }) =>
    fetchJson(api("/route"), routeSchema.nullable(), {
      method: "POST",
      body: { village_id: villageId, vehicle, simulation: { water_level_m: waterLevelM } },
    }),
  metrics: () => fetchJson(api("/metrics"), z.array(metricSchema)),
  replayEval: () => fetchJson(api("/replay-eval"), z.array(replayEvalSchema)),
};
