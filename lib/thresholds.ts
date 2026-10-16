import type { RoadState, Vehicle } from "@/types/data";

export interface PassabilityThresholds {
  car_cm: number;
  truck_cm: number;
}

export const DEFAULT_THRESHOLDS: PassabilityThresholds = { car_cm: 30, truck_cm: 60 };

export function thresholdFor(vehicle: Vehicle, thresholds: PassabilityThresholds): number {
  return vehicle === "car" ? thresholds.car_cm : thresholds.truck_cm;
}

// Mirrors the access engine: water up to the car limit is safe, above the chosen vehicle's limit the
// road is cut for it, and in between it is limited. Roads without a depth keep their status.
export function statusFromDepth(
  road: RoadState,
  vehicle: Vehicle,
  thresholds: PassabilityThresholds,
): RoadState {
  if (road.depth_cm === null || road.status === 3) return road;
  if (road.depth_cm <= thresholds.car_cm) return { ...road, status: 0 };
  const status = road.depth_cm > thresholdFor(vehicle, thresholds) ? 2 : 1;
  return { ...road, status };
}

export function reclassifyRoads(
  roads: readonly RoadState[],
  vehicle: Vehicle,
  thresholds: PassabilityThresholds,
): RoadState[] {
  return roads.map((road) => statusFromDepth(road, vehicle, thresholds));
}
