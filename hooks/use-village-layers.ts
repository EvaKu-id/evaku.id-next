"use client";

import { useEffect, useRef } from "react";
import type { FeatureIdentifier, Map as MaplibreMap, MapLayerMouseEvent } from "maplibre-gl";
import { VILLAGE_TILES, pmtilesUrl } from "@/lib/map-config";
import { addOrderedLayer, setLayersVisible } from "@/lib/map-order";
import { POINT_LAYERS } from "@/lib/map-hit";
import { onStyleReady } from "@/lib/map-style";
import { PALETTE } from "@/lib/palette";
import { villageFillColor, villageFillOpacity } from "@/lib/road-style";
import type { VillageFill, VillageFillMode } from "@/types/map";

interface UseVillageLayersOptions {
  map: MaplibreMap | null;
  villages?: readonly VillageFill[];
  mode?: VillageFillMode;
  selectedId?: string | null;
  onSelectVillage?: (villageId: string) => void;
}

const FILL_LAYER = "villages-fill";
const LINE_LAYER = "villages-line";
const SELECTED_LAYER = "villages-selected";
const CLICK_BLOCKERS = ["roads-major", "roads-minor", "roads-path", ...POINT_LAYERS];

function villageFeature(id: string): FeatureIdentifier {
  return { source: VILLAGE_TILES.source, sourceLayer: VILLAGE_TILES.sourceLayer, id };
}

function addVillageLayers(map: MaplibreMap, mode: VillageFillMode) {
  if (!map.getSource(VILLAGE_TILES.source)) {
    map.addSource(VILLAGE_TILES.source, {
      type: "vector",
      url: pmtilesUrl("desa.pmtiles"),
      promoteId: { [VILLAGE_TILES.sourceLayer]: "village_id" },
    });
  }
  const fillMode = mode === "none" ? "status" : mode;
  addOrderedLayer(map, {
    id: FILL_LAYER,
    type: "fill",
    source: VILLAGE_TILES.source,
    "source-layer": VILLAGE_TILES.sourceLayer,
    paint: { "fill-color": villageFillColor(fillMode), "fill-opacity": villageFillOpacity(fillMode) },
  });
  addOrderedLayer(map, {
    id: LINE_LAYER,
    type: "line",
    source: VILLAGE_TILES.source,
    "source-layer": VILLAGE_TILES.sourceLayer,
    minzoom: 8,
    paint: { "line-color": PALETTE.muted, "line-width": 0.6, "line-opacity": 0.35 },
  });
  addOrderedLayer(map, {
    id: SELECTED_LAYER,
    type: "line",
    source: VILLAGE_TILES.source,
    "source-layer": VILLAGE_TILES.sourceLayer,
    paint: {
      "line-color": PALETTE.brand,
      "line-width": 3,
      "line-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 1, 0],
    },
  });
}

function applyFillMode(map: MaplibreMap, mode: VillageFillMode) {
  if (!map.getLayer(FILL_LAYER)) return;
  setLayersVisible(map, [FILL_LAYER], mode !== "none");
  if (mode === "none") return;
  map.setPaintProperty(FILL_LAYER, "fill-color", villageFillColor(mode));
  map.setPaintProperty(FILL_LAYER, "fill-opacity", villageFillOpacity(mode));
}

function applyVillageStates(map: MaplibreMap, villages: readonly VillageFill[], selectedId: string | null) {
  if (!map.getSource(VILLAGE_TILES.source)) return;
  map.removeFeatureState({ source: VILLAGE_TILES.source, sourceLayer: VILLAGE_TILES.sourceLayer });
  for (const village of villages) {
    map.setFeatureState(villageFeature(village.village_id), {
      status: village.status,
      p: village.probability ?? -1,
      cat: village.category ?? "none",
    });
  }
  if (selectedId) map.setFeatureState(villageFeature(selectedId), { selected: true });
}

export function useVillageLayers({
  map,
  villages,
  mode = "status",
  selectedId = null,
  onSelectVillage,
}: UseVillageLayersOptions) {
  const stateRef = useRef({ villages: villages ?? [], mode, selectedId });
  const onSelectRef = useRef(onSelectVillage);

  useEffect(() => {
    onSelectRef.current = onSelectVillage;
  }, [onSelectVillage]);

  useEffect(() => {
    if (!map) return;
    const stopStyle = onStyleReady(map, () => {
      const { villages: current, mode: currentMode, selectedId: selected } = stateRef.current;
      addVillageLayers(map, currentMode);
      applyFillMode(map, currentMode);
      applyVillageStates(map, current, selected);
    });

    function handleClick(e: MapLayerMouseEvent) {
      if (!map) return;
      // Roads and points sit on top; let their own click handlers win.
      const layers = CLICK_BLOCKERS.filter((id) => map.getLayer(id));
      if (layers.length > 0 && map.queryRenderedFeatures(e.point, { layers }).length > 0) return;
      const id = e.features?.[0]?.id;
      if (id !== undefined) onSelectRef.current?.(String(id));
    }
    const subscription = map.on("click", FILL_LAYER, handleClick);
    return () => {
      stopStyle();
      subscription.unsubscribe();
    };
  }, [map]);

  useEffect(() => {
    stateRef.current = { villages: villages ?? [], mode, selectedId };
    if (!map) return;
    applyFillMode(map, mode);
    applyVillageStates(map, stateRef.current.villages, selectedId);
  }, [map, villages, mode, selectedId]);
}
