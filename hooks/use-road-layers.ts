"use client";

import { useEffect, useRef } from "react";
import { PALETTE } from "@/lib/palette";
import {
  Popup,
  type FeatureIdentifier,
  type Map as MaplibreMap,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import { ROAD_TILES, pmtilesUrl } from "@/lib/map-config";
import { onStyleReady } from "@/lib/map-style";
import { lineLengthM } from "@/lib/geo";
import { pointUnderCursor } from "@/lib/map-hit";
import { ROAD_STATUS, highwayLabel, isRoadStatusCode, type RoadStatusCode } from "@/lib/status";
import { addOrderedLayer, setLayersVisible, type OrderedLayerId } from "@/lib/map-order";
import {
  ROAD_LINE_LAYER_IDS,
  ROAD_TIERS,
  roadColor,
  roadCutId,
  roadCutOpacity,
  roadCutWidth,
  roadLineId,
  roadOpacity,
  roadTierFilter,
  roadWidth,
} from "@/lib/road-style";
import type { RoadState } from "@/types/data";

export interface SelectedRoadInfo {
  edge_id: number;
  highway_type: string;
  is_bridge: boolean;
  length_m: number | null;
  status: number;
  depth_cm: number | null;
  lngLat?: [number, number];
}

interface UseRoadLayersOptions {
  map: MaplibreMap | null;
  roads?: readonly RoadState[];
  visible?: boolean;
  onSelectRoad?: (road: SelectedRoadInfo | null) => void;
}

function isTruthy(value: unknown): boolean {
  return value === true || value === 1 || value === "true" || value === "1";
}

function roadFeature(id: number | string): FeatureIdentifier {
  return { source: ROAD_TILES.source, sourceLayer: ROAD_TILES.sourceLayer, id };
}

// Minor roads first so major roads are drawn on top; dashes for cut roads go above all lines.
const DRAW_ORDER = [...ROAD_TIERS].reverse();

function addRoadLayers(map: MaplibreMap) {
  if (!map.getSource(ROAD_TILES.source)) {
    map.addSource(ROAD_TILES.source, {
      type: "vector",
      url: pmtilesUrl("jalan.pmtiles"),
      promoteId: { [ROAD_TILES.sourceLayer]: "edge_id" },
    });
  }

  for (const style of DRAW_ORDER) {
    addOrderedLayer(map, {
      id: roadLineId(style.tier),
      type: "line",
      source: ROAD_TILES.source,
      "source-layer": ROAD_TILES.sourceLayer,
      minzoom: style.minzoom,
      filter: roadTierFilter(style),
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": roadColor(),
        "line-width": roadWidth(style),
        "line-opacity": roadOpacity(),
      },
    });
  }

  for (const style of DRAW_ORDER) {
    addOrderedLayer(map, {
      id: roadCutId(style.tier),
      type: "line",
      source: ROAD_TILES.source,
      "source-layer": ROAD_TILES.sourceLayer,
      minzoom: style.minzoom,
      filter: roadTierFilter(style),
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": PALETTE.surface,
        "line-width": roadCutWidth(style),
        "line-dasharray": [2, 2],
        "line-opacity": roadCutOpacity(),
      },
    });
  }
}

function applyRoadStates(map: MaplibreMap, roads: readonly RoadState[]) {
  if (!map.getSource(ROAD_TILES.source)) return;
  // Only unsafe roads are listed, so stale states must be cleared first.
  map.removeFeatureState({
    source: ROAD_TILES.source,
    sourceLayer: ROAD_TILES.sourceLayer,
  });
  for (const road of roads) {
    map.setFeatureState(roadFeature(road.edge_id), {
      status: road.status,
      depth_cm: road.depth_cm ?? 0,
    });
  }
}

const ALL_ROAD_LAYERS: OrderedLayerId[] = ROAD_TIERS.flatMap(({ tier }) => [roadLineId(tier), roadCutId(tier)]);

export function useRoadLayers({ map, roads, visible = true, onSelectRoad }: UseRoadLayersOptions) {
  const visibleRef = useRef(visible);
  const hoveredIdRef = useRef<number | string | null>(null);
  const onSelectRoadRef = useRef(onSelectRoad);
  const roadsRef = useRef<readonly RoadState[]>(roads ?? []);

  useEffect(() => {
    onSelectRoadRef.current = onSelectRoad;
  }, [onSelectRoad]);

  useEffect(() => {
    if (!map) return;

    const stopStyleListener = onStyleReady(map, () => {
      addRoadLayers(map);
      setLayersVisible(map, ALL_ROAD_LAYERS, visibleRef.current);
      applyRoadStates(map, roadsRef.current);
    });

    function setHover(id: number | string | null) {
      if (!map || hoveredIdRef.current === id) return;
      if (hoveredIdRef.current !== null) {
        map.setFeatureState(roadFeature(hoveredIdRef.current), { hover: false });
      }
      hoveredIdRef.current = id;
      if (id !== null) map.setFeatureState(roadFeature(id), { hover: true });
    }

    const tooltip = new Popup({ closeButton: false, closeOnClick: false, offset: 12, className: "evaku-tip" });

    function handleMove(e: MapLayerMouseEvent) {
      const feature = e.features?.[0];
      if (!map || !feature) return;
      if (pointUnderCursor(map, e.point)) {
        setHover(null);
        tooltip.remove();
        return;
      }
      map.getCanvas().style.cursor = "pointer";
      setHover(feature.id ?? null);
      const state = feature.id === undefined ? {} : map.getFeatureState(roadFeature(feature.id));
      const raw: unknown = state.status;
      const code: RoadStatusCode = typeof raw === "number" && isRoadStatusCode(raw) ? raw : 0;
      const meta = ROAD_STATUS[code];
      const depth = typeof state.depth_cm === "number" && state.depth_cm > 0 ? ` · ${Math.round(state.depth_cm)} cm` : "";
      tooltip
        .setLngLat(e.lngLat)
        .setHTML(
          `<div class="px-3 py-2 text-xs"><p class="label-data">${highwayLabel(String(feature.properties?.highway_type ?? ""))}</p>` +
            `<p class="mt-0.5 flex items-center gap-1.5 font-semibold text-ink"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${meta.color}"></span>${meta.label}<span class="font-normal text-muted">${meta.description}${depth}</span></p></div>`,
        )
        .addTo(map);
    }

    function handleLeave() {
      if (!map) return;
      map.getCanvas().style.cursor = "";
      setHover(null);
      tooltip.remove();
    }

    function handleClick(e: MapLayerMouseEvent) {
      const feature = e.features?.[0];
      if (!map || !feature || pointUnderCursor(map, e.point)) return;
      tooltip.remove();
      const edgeId = Number(feature.id ?? feature.properties?.edge_id);
      const highway = String(feature.properties?.highway_type ?? "road");
      const state = map.getFeatureState(roadFeature(edgeId));

      onSelectRoadRef.current?.({
        edge_id: edgeId,
        highway_type: highway,
        is_bridge: isTruthy(feature.properties?.is_bridge),
        length_m: lineLengthM(feature.geometry),
        status: typeof state.status === "number" ? state.status : 0,
        depth_cm: typeof state.depth_cm === "number" ? state.depth_cm : null,
        lngLat: [e.lngLat.lng, e.lngLat.lat],
      });
    }

    const subscriptions = [
      map.on("mousemove", ROAD_LINE_LAYER_IDS, handleMove),
      map.on("mouseleave", ROAD_LINE_LAYER_IDS, handleLeave),
      map.on("click", ROAD_LINE_LAYER_IDS, handleClick),
    ];

    return () => {
      stopStyleListener();
      tooltip.remove();
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [map]);

  useEffect(() => {
    visibleRef.current = visible;
    if (map) setLayersVisible(map, ALL_ROAD_LAYERS, visible);
  }, [map, visible]);

  useEffect(() => {
    roadsRef.current = roads ?? [];
    // Not gated on isStyleLoaded(): that stays false while tiles load, which would drop the update.
    if (map) applyRoadStates(map, roadsRef.current);
  }, [map, roads]);
}
