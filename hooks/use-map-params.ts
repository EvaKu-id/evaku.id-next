"use client";

import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { isHorizon } from "@/lib/forecast";
import { clampLevel } from "@/lib/data/paths";
import type { Horizon, MapMode, MapScope, Vehicle } from "@/types/data";
import type { MapLayersVisibility } from "@/types/map";

const MODES = ["prakiraan", "radar", "simulasi"] as const;
const SCOPES = ["region", "national"] as const;
const VEHICLES = ["car", "truck"] as const;
const LAYER_KEYS = ["roads", "villages", "flood", "places", "route"] as const;

const parsers = {
  mode: parseAsStringLiteral(MODES).withDefault("prakiraan"),
  scope: parseAsStringLiteral(SCOPES).withDefault("region"),
  h: parseAsInteger.withDefault(72),
  date: parseAsString,
  level: parseAsFloat.withDefault(1.5),
  vehicle: parseAsStringLiteral(VEHICLES).withDefault("car"),
  desa: parseAsString,
  panel: parseAsString,
  layers: parseAsArrayOf(parseAsStringLiteral(LAYER_KEYS)),
};

export interface MapParams {
  mode: MapMode;
  scope: MapScope;
  horizon: Horizon;
  date: string | null;
  level: number;
  vehicle: Vehicle;
  desa: string | null;
  panel: string | null;
  layers: MapLayersVisibility;
}

export function useMapParams() {
  const [raw, setRaw] = useQueryStates(parsers, { history: "replace", scroll: false });
  const only = raw.layers;
  const layers: MapLayersVisibility = {
    roads: !only || only.includes("roads"),
    villages: !only || only.includes("villages"),
    flood: !only || only.includes("flood"),
    places: !only || only.includes("places"),
    route: !only || only.includes("route"),
  };
  const params: MapParams = {
    mode: raw.mode,
    scope: raw.scope,
    horizon: isHorizon(raw.h) ? raw.h : 72,
    date: raw.date,
    level: clampLevel(raw.level),
    vehicle: raw.vehicle,
    desa: raw.desa,
    panel: raw.panel,
    layers,
  };

  function setLayers(next: MapLayersVisibility) {
    const keys = LAYER_KEYS.filter((key) => next[key]);
    void setRaw({ layers: keys.length === LAYER_KEYS.length ? null : keys });
  }

  return { params, setParams: setRaw, setLayers };
}
