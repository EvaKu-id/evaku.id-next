import type { Vehicle } from "@/types/data";

export const queryKeys = {
  manifest: ["manifest"] as const,
  roads: (runId: string) => ["roads", runId] as const,
  villages: (runId: string) => ["villages", runId] as const,
  forecasts: ["forecasts"] as const,
  village: (villageId: string, runId: string) => ["village", villageId, runId] as const,
  simulation: (vehicle: Vehicle, level: number) => ["simulation", vehicle, level] as const,
  simLevels: ["sim-levels"] as const,
  route: (villageId: string, vehicle: Vehicle, level: number) =>
    ["route", villageId, vehicle, level] as const,
  metrics: ["metrics"] as const,
  replayEval: ["replay-eval"] as const,
  floodIndex: ["flood-index"] as const,
  lowConfidence: ["low-confidence"] as const,
  evacuationSites: ["evacuation-sites"] as const,
  hubs: ["hubs"] as const,
  provinces: ["provinces"] as const,
  nationalFloods: ["national-floods"] as const,
  activeRegions: ["active-regions"] as const,
};
