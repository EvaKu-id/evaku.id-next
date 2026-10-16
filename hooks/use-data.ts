"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dataSource } from "@/lib/data";
import { clampLevel, routeLevel } from "@/lib/data/paths";
import { queryKeys } from "@/lib/query-keys";
import type { Vehicle } from "@/types/data";

const STATIC_DATA = { staleTime: Infinity } as const;

export function useManifest() {
  return useQuery({ queryKey: queryKeys.manifest, queryFn: () => dataSource.manifest() });
}

export function useRunRoads(runId: string | null) {
  return useQuery({
    queryKey: queryKeys.roads(runId ?? ""),
    queryFn: () => dataSource.roads(runId ?? ""),
    enabled: runId !== null,
    placeholderData: keepPreviousData,
  });
}

export function useRunVillages(runId: string | null) {
  return useQuery({
    queryKey: queryKeys.villages(runId ?? ""),
    queryFn: () => dataSource.villages(runId ?? ""),
    enabled: runId !== null,
    placeholderData: keepPreviousData,
  });
}

export function useForecasts() {
  return useQuery({ queryKey: queryKeys.forecasts, queryFn: () => dataSource.forecasts() });
}

export function useVillage(villageId: string | null, runId: string | null) {
  return useQuery({
    queryKey: queryKeys.village(villageId ?? "", runId ?? ""),
    queryFn: () => dataSource.village(villageId ?? "", runId ?? ""),
    enabled: villageId !== null && runId !== null,
    placeholderData: keepPreviousData,
  });
}

export function useSimulation(level: number, vehicle: Vehicle, enabled = true) {
  const snapped = clampLevel(level);
  return useQuery({
    queryKey: queryKeys.simulation(vehicle, snapped),
    queryFn: ({ signal }) => dataSource.simulate({ waterLevelM: snapped, vehicle }, signal),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSimLevels() {
  return useQuery({ queryKey: queryKeys.simLevels, queryFn: () => dataSource.simLevels(), ...STATIC_DATA });
}

export function useRoute(villageId: string | null, vehicle: Vehicle, level: number) {
  const stepped = routeLevel(level);
  return useQuery({
    queryKey: queryKeys.route(villageId ?? "", vehicle, stepped),
    queryFn: () => dataSource.route({ villageId: villageId ?? "", vehicle, waterLevelM: stepped }),
    enabled: villageId !== null,
  });
}

export function useMetrics() {
  return useQuery({ queryKey: queryKeys.metrics, queryFn: () => dataSource.metrics() });
}

export function useReplayEval() {
  return useQuery({ queryKey: queryKeys.replayEval, queryFn: () => dataSource.replayEval() });
}

export function useFloodIndex() {
  return useQuery({ queryKey: queryKeys.floodIndex, queryFn: () => dataSource.floodIndex(), ...STATIC_DATA });
}

export function useLowConfidence(enabled = true) {
  return useQuery({
    queryKey: queryKeys.lowConfidence,
    queryFn: () => dataSource.lowConfidence(),
    enabled,
    ...STATIC_DATA,
  });
}

export function useEvacuationSites(enabled = true) {
  return useQuery({
    queryKey: queryKeys.evacuationSites,
    queryFn: () => dataSource.evacuationSites(),
    enabled,
    ...STATIC_DATA,
  });
}

export function useHubs(enabled = true) {
  return useQuery({ queryKey: queryKeys.hubs, queryFn: () => dataSource.hubs(), enabled, ...STATIC_DATA });
}

export function useProvinces(enabled = true) {
  return useQuery({
    queryKey: queryKeys.provinces,
    queryFn: () => dataSource.provinces(),
    enabled,
    ...STATIC_DATA,
  });
}

export function useNationalFloods() {
  return useQuery({
    queryKey: queryKeys.nationalFloods,
    queryFn: () => dataSource.nationalFloods(),
    ...STATIC_DATA,
  });
}

export function useActiveRegions() {
  return useQuery({
    queryKey: queryKeys.activeRegions,
    queryFn: () => dataSource.activeRegions(),
    ...STATIC_DATA,
  });
}
