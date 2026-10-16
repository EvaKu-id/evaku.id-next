import { MAP_DATA_VERSION } from "@/lib/map-config";

export const DATA_ROOT = "/data";
export const DATA_BASE = `${DATA_ROOT}/${MAP_DATA_VERSION}`;
export const NATIONAL_BASE = `${DATA_ROOT}/national`;

export const SIM_STEP_M = 0.1;
export const SIM_MAX_M = 5;
export const ROUTE_STEP_M = 0.5;

export function levelKey(waterLevelM: number): string {
  const cm = Math.round(clampLevel(waterLevelM) * 100);
  return String(cm).padStart(3, "0");
}

export function clampLevel(waterLevelM: number): number {
  const snapped = Math.round(waterLevelM / SIM_STEP_M) * SIM_STEP_M;
  return Math.min(SIM_MAX_M, Math.max(0, Number(snapped.toFixed(1))));
}

// Routes are kept per half metre; a level between two steps uses the lower one so a route never
// assumes less water than the step it was computed for would allow.
export function routeLevel(waterLevelM: number): number {
  const stepped = Math.floor(clampLevel(waterLevelM) / ROUTE_STEP_M + 1e-9) * ROUTE_STEP_M;
  return Math.max(ROUTE_STEP_M, Number(stepped.toFixed(1)));
}
