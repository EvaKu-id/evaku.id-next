"use client";

import { useMemo } from "react";
import type { ExpressionSpecification, GeoJSONSource, Map as MaplibreMap } from "maplibre-gl";
import { useStyleSync } from "@/hooks/use-style-sync";
import { addOrderedLayer, setLayersVisible } from "@/lib/map-order";
import { PALETTE } from "@/lib/palette";
import type { Evacuation, Route } from "@/types/data";
import type { LngLat } from "@/types/map";

export interface RouteOverlay {
  route: Route | null;
  villageCenter: LngLat | null;
  evacuations: readonly Evacuation[] | null;
}

interface RouteData extends RouteOverlay {
  visible: boolean;
}

const SOURCE = "route";
const LAYERS = ["evac-route-line", "route-line-casing", "route-line", "route-boat", "route-points"] as const;

type Feature = GeoJSON.Feature<GeoJSON.Geometry, { kind: string; rank?: number }>;

export function routeFeatures({ route, villageCenter, evacuations }: RouteOverlay): GeoJSON.FeatureCollection {
  const features: Feature[] = [];
  if (route && route.coordinates.length > 1) {
    features.push({ type: "Feature", properties: { kind: "land" }, geometry: { type: "LineString", coordinates: route.coordinates } });
    features.push({ type: "Feature", properties: { kind: "hub" }, geometry: { type: "Point", coordinates: route.coordinates[0] } });
    if (route.boat_point && villageCenter) {
      const boat: LngLat = [route.boat_point.lon, route.boat_point.lat];
      features.push({ type: "Feature", properties: { kind: "boat" }, geometry: { type: "LineString", coordinates: [boat, villageCenter] } });
      features.push({ type: "Feature", properties: { kind: "boat-point" }, geometry: { type: "Point", coordinates: boat } });
    }
  }
  for (const site of evacuations ?? []) {
    if (site.route.length > 1) {
      features.push({ type: "Feature", properties: { kind: "evac", rank: site.rank }, geometry: { type: "LineString", coordinates: site.route } });
    }
    features.push({ type: "Feature", properties: { kind: "evac-point", rank: site.rank }, geometry: { type: "Point", coordinates: [site.lon, site.lat] } });
  }
  return { type: "FeatureCollection", features };
}

function syncRoute(map: MaplibreMap, data: RouteData) {
  if (!map.getSource(SOURCE)) {
    map.addSource(SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
  }
  map.getSource<GeoJSONSource>(SOURCE)?.setData(routeFeatures(data));

  const kind: ExpressionSpecification = ["get", "kind"];
  addOrderedLayer(map, {
    id: "evac-route-line",
    type: "line",
    source: SOURCE,
    filter: ["==", kind, "evac"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": PALETTE.site, "line-width": 3, "line-opacity": ["match", ["get", "rank"], 1, 0.95, 0.45] },
  });
  addOrderedLayer(map, {
    id: "route-line-casing",
    type: "line",
    source: SOURCE,
    filter: ["==", kind, "land"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": PALETTE.surface, "line-width": 7 },
  });
  addOrderedLayer(map, {
    id: "route-line",
    type: "line",
    source: SOURCE,
    filter: ["==", kind, "land"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": PALETTE.brand, "line-width": 4 },
  });
  addOrderedLayer(map, {
    id: "route-boat",
    type: "line",
    source: SOURCE,
    filter: ["==", kind, "boat"],
    layout: { "line-cap": "round" },
    paint: { "line-color": PALETTE.water3, "line-width": 3, "line-dasharray": [1.5, 1.5] },
  });
  addOrderedLayer(map, {
    id: "route-points",
    type: "circle",
    source: SOURCE,
    filter: ["in", kind, ["literal", ["hub", "boat-point", "evac-point"]]],
    paint: {
      "circle-radius": ["match", kind, "hub", 7, "boat-point", 6, 6],
      "circle-color": ["match", kind, "hub", PALETTE.ink, "boat-point", PALETTE.water3, PALETTE.site],
      "circle-stroke-color": PALETTE.surface,
      "circle-stroke-width": 2.5,
    },
  });
  setLayersVisible(map, LAYERS, data.visible);
}

export function useRouteLayer(map: MaplibreMap | null, overlay: RouteOverlay, visible: boolean) {
  const { route, villageCenter, evacuations } = overlay;
  const data = useMemo(
    () => ({ route, villageCenter, evacuations, visible }),
    [route, villageCenter, evacuations, visible],
  );
  useStyleSync(map, data, syncRoute);
}
