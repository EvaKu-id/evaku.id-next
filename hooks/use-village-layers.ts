"use client";

import { useEffect, useRef } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { VILLAGE_TILES, pmtilesUrl } from "@/lib/map-config";
import { onStyleReady } from "@/lib/map-style";
import { roadLineId, villageFillColor, villageFillOpacity } from "@/lib/road-style";
import type { VillageAccess } from "@/types/map";

interface UseVillageLayersOptions {
  map: MaplibreMap | null;
  villages?: readonly VillageAccess[];
}

const FILL_LAYER = "villages-fill";
const LINE_LAYER = "villages-line";
const LOWEST_ROAD_LAYER = roadLineId("path");

function addVillageLayers(map: MaplibreMap) {
  if (!map.getSource(VILLAGE_TILES.source)) {
    map.addSource(VILLAGE_TILES.source, {
      type: "vector",
      url: pmtilesUrl("desa.pmtiles"),
      promoteId: { [VILLAGE_TILES.sourceLayer]: "village_id" },
    });
  }

  // Village areas must stay under the roads even when the road layers were added first.
  const beforeId = map.getLayer(LOWEST_ROAD_LAYER) ? LOWEST_ROAD_LAYER : undefined;

  if (!map.getLayer(FILL_LAYER)) {
    map.addLayer(
      {
        id: FILL_LAYER,
        type: "fill",
        source: VILLAGE_TILES.source,
        "source-layer": VILLAGE_TILES.sourceLayer,
        paint: {
          "fill-color": villageFillColor(),
          "fill-opacity": villageFillOpacity(),
        },
      },
      beforeId,
    );
  }

  if (!map.getLayer(LINE_LAYER)) {
    map.addLayer(
      {
        id: LINE_LAYER,
        type: "line",
        source: VILLAGE_TILES.source,
        "source-layer": VILLAGE_TILES.sourceLayer,
        minzoom: 9,
        paint: {
          "line-color": "#94a3b8",
          "line-width": 0.5,
          "line-opacity": 0.4,
        },
      },
      beforeId,
    );
  }
}

function applyVillageStates(map: MaplibreMap, villages: readonly VillageAccess[]) {
  if (!map.getSource(VILLAGE_TILES.source)) return;
  map.removeFeatureState({
    source: VILLAGE_TILES.source,
    sourceLayer: VILLAGE_TILES.sourceLayer,
  });
  for (const village of villages) {
    map.setFeatureState(
      {
        source: VILLAGE_TILES.source,
        sourceLayer: VILLAGE_TILES.sourceLayer,
        id: village.village_id,
      },
      { status: village.status },
    );
  }
}

export function useVillageLayers({ map, villages }: UseVillageLayersOptions) {
  const villagesRef = useRef<readonly VillageAccess[]>(villages ?? []);

  useEffect(() => {
    if (!map) return;
    return onStyleReady(map, () => {
      addVillageLayers(map);
      applyVillageStates(map, villagesRef.current);
    });
  }, [map]);

  useEffect(() => {
    villagesRef.current = villages ?? [];
    if (map) applyVillageStates(map, villagesRef.current);
  }, [map, villages]);
}
