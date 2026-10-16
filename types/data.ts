import type { z } from "zod";
import type {
  activeRegionSchema,
  evacuationSchema,
  evacuationSitesSchema,
  featureCollectionSchema,
  floodIndexSchema,
  forecastRowSchema,
  forecastRunSchema,
  horizonEnum,
  hubsSchema,
  manifestSchema,
  metricSchema,
  nationalFloodsSchema,
  photoCreditSchema,
  radarRunSchema,
  regionSchema,
  replayEvalSchema,
  roadStatusSchema,
  routeSchema,
  runVillageSchema,
  scoreComponentEnum,
  scoreItemSchema,
  simLevelSchema,
  simRoutesSchema,
  simulationSchema,
  sourceEnum,
  vehicleEnum,
  villageFileSchema,
  villageRunSchema,
  villageStatusEnum,
} from "@/lib/data/schemas";

export type Manifest = z.infer<typeof manifestSchema>;
export type Region = z.infer<typeof regionSchema>;
export type ForecastRun = z.infer<typeof forecastRunSchema>;
export type RadarRun = z.infer<typeof radarRunSchema>;
export type Horizon = z.infer<typeof horizonEnum>;
export type Vehicle = z.infer<typeof vehicleEnum>;
export type VillageStatus = z.infer<typeof villageStatusEnum>;
export type RoadState = z.infer<typeof roadStatusSchema>;
export type RunVillage = z.infer<typeof runVillageSchema>;
export type ForecastRow = z.infer<typeof forecastRowSchema>;
export type Route = z.infer<typeof routeSchema>;
export type Evacuation = z.infer<typeof evacuationSchema>;
export type ScoreComponent = z.infer<typeof scoreComponentEnum>;
export type ScoreItem = z.infer<typeof scoreItemSchema>;
export type VillageRun = z.infer<typeof villageRunSchema>;
export type VillageFile = z.infer<typeof villageFileSchema>;
export type Simulation = z.infer<typeof simulationSchema>;
export type SimLevel = z.infer<typeof simLevelSchema>;
export type SimRoutes = z.infer<typeof simRoutesSchema>;
export type FloodIndex = z.infer<typeof floodIndexSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type ReplayEval = z.infer<typeof replayEvalSchema>;
export type NationalFloods = z.infer<typeof nationalFloodsSchema>;
export type ActiveRegion = z.infer<typeof activeRegionSchema>;
export type EvacuationSites = z.infer<typeof evacuationSitesSchema>;
export type Hubs = z.infer<typeof hubsSchema>;
export type GenericFeatureCollection = z.infer<typeof featureCollectionSchema>;
export type PhotoCredit = z.infer<typeof photoCreditSchema>;
export type ResultSource = z.infer<typeof sourceEnum>;

export type MapMode = "prakiraan" | "radar" | "simulasi";
export type MapScope = "national" | "region";

export interface VillageDetail extends Omit<VillageFile, "runs"> {
  run_id: string;
  run: VillageRun;
}

export interface SimulationParams {
  waterLevelM: number;
  vehicle: Vehicle;
}

export interface RouteParams {
  villageId: string;
  vehicle: Vehicle;
  waterLevelM: number;
}
