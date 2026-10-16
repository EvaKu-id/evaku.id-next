import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { MAP_DATA_VERSION } from "@/lib/map-config";
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
  photoCreditSchema,
  replayEvalSchema,
  roadStatusSchema,
  runVillageSchema,
  simLevelSchema,
  simRoutesSchema,
  simulationSchema,
  villageFileSchema,
} from "@/lib/data/schemas";

const PUBLIC = join(import.meta.dir, "..", "public");
const BASE = join(PUBLIC, "data", MAP_DATA_VERSION);
const NATIONAL = join(PUBLIC, "data", "national");

function load(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("data files", () => {
  test("manifest and run files match the UI schemas", () => {
    const manifest = manifestSchema.parse(load(join(BASE, "manifest.json")));
    const runs = [...manifest.forecast_runs, ...manifest.radar_runs].map((run) => run.run_id);
    expect(manifest.forecast_runs.map((run) => run.horizon_hours)).toEqual([24, 48, 72]);
    for (const runId of runs) {
      z.array(roadStatusSchema).parse(load(join(BASE, "runs", runId, "roads.json")));
      const villages = z.array(runVillageSchema).parse(load(join(BASE, "runs", runId, "villages.json")));
      expect(villages).toHaveLength(manifest.region.villages);
    }
  });

  test("every village file covers every run", () => {
    const manifest = manifestSchema.parse(load(join(BASE, "manifest.json")));
    const runs = [...manifest.forecast_runs, ...manifest.radar_runs].map((run) => run.run_id);
    const files = readdirSync(join(BASE, "villages"));
    expect(files).toHaveLength(manifest.region.villages);
    for (const file of files) {
      const village = villageFileSchema.parse(load(join(BASE, "villages", file)));
      expect(Object.keys(village.runs).sort()).toEqual([...runs].sort());
    }
  });

  test("forecasts, metrics, evaluation, flood index and places parse", () => {
    z.array(forecastRowSchema).parse(load(join(BASE, "forecasts.json")));
    z.array(metricSchema).min(1).parse(load(join(BASE, "metrics.json")));
    z.array(replayEvalSchema).parse(load(join(BASE, "replay-eval.json")));
    const flood = floodIndexSchema.parse(load(join(BASE, "flood", "index.json")));
    for (const entry of flood.dates) expect(existsSync(join(BASE, "flood", `${entry.date}.png`))).toBe(true);
    featureCollectionSchema.parse(load(join(BASE, "flood", "low-confidence.geojson")));
    evacuationSitesSchema.parse(load(join(BASE, "places", "evacuation-sites.geojson")));
    hubsSchema.parse(load(join(BASE, "places", "hubs.geojson")));
  });

  test("simulation covers 0–5 m in 10 cm steps for both vehicles", () => {
    const levels = z.array(simLevelSchema).parse(load(join(BASE, "sim", "levels.json")));
    expect(levels).toHaveLength(102);
    for (const vehicle of ["car", "truck"]) {
      for (let cm = 0; cm <= 500; cm += 10) {
        simulationSchema.parse(load(join(BASE, "sim", vehicle, `${String(cm).padStart(3, "0")}.json`)));
      }
    }
    const car = levels.filter((level) => level.vehicle === "car").sort((a, b) => a.water_level_m - b.water_level_m);
    for (let i = 1; i < car.length; i += 1) expect(car[i].cut_road_km).toBeGreaterThanOrEqual(car[i - 1].cut_road_km);
  });

  test("route files parse", () => {
    for (const file of readdirSync(join(BASE, "sim", "routes")).slice(0, 40)) {
      simRoutesSchema.parse(load(join(BASE, "sim", "routes", file)));
    }
  });

  test("national layers are consistent", () => {
    const floods = nationalFloodsSchema.parse(load(join(NATIONAL, "floods-2024.json")));
    expect(floods.provinces.reduce((sum, p) => sum + p.floods, 0)).toBe(floods.total_floods);
    const provinces = featureCollectionSchema.parse(load(join(NATIONAL, "provinces.geojson")));
    const codes = new Set(provinces.features.map((f) => String(f.properties?.pcode)));
    for (const province of floods.provinces) expect(codes.has(province.pcode)).toBe(true);
    z.array(activeRegionSchema).min(1).parse(load(join(NATIONAL, "active-regions.json")));
  });

  test("photo credits are complete", () => {
    const credits = z.array(photoCreditSchema).min(1).parse(load(join(PUBLIC, "photos", "credits.json")));
    for (const credit of credits) expect(existsSync(join(PUBLIC, credit.file))).toBe(true);
  });
});
