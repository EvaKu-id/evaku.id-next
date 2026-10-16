import type { RoadState, RunVillage } from "@/types/data";

export interface RunSummary {
  isolatedVillages: number;
  partialVillages: number;
  isolatedPopulation: number;
  children: number;
  elderly: number;
  cutRoadKm: number;
  limitedRoadKm: number;
}

interface VillageCounts {
  status: RunVillage["status"];
  isolated_population: number;
  children_under5?: number;
  elderly?: number;
}

// Roads must already be classified for the chosen vehicle (see lib/thresholds.ts).
export function summarize(villages: readonly VillageCounts[], roads: readonly RoadState[]): RunSummary {
  let isolatedVillages = 0;
  let partialVillages = 0;
  let isolatedPopulation = 0;
  let children = 0;
  let elderly = 0;
  for (const village of villages) {
    if (village.status === "fully_isolated") isolatedVillages += 1;
    if (village.status === "partially_isolated") partialVillages += 1;
    if (village.status !== "reachable") {
      isolatedPopulation += village.isolated_population;
      children += village.children_under5 ?? 0;
      elderly += village.elderly ?? 0;
    }
  }
  let cut = 0;
  let limited = 0;
  for (const road of roads) {
    const length = road.length_m ?? 0;
    if (road.status === 2) cut += length;
    if (road.status === 1) limited += length;
  }
  return {
    isolatedVillages,
    partialVillages,
    isolatedPopulation,
    children,
    elderly,
    cutRoadKm: cut / 1000,
    limitedRoadKm: limited / 1000,
  };
}
