"use client";

import { useEffect, useMemo, useRef } from "react";
import type { GeoJSONSource, Map as MaplibreMap, MapLayerMouseEvent } from "maplibre-gl";
import { addOrderedLayer, setLayersVisible } from "@/lib/map-order";
import { useStyleSync } from "@/hooks/use-style-sync";
import { NATIONAL_SCALE, classIndex, quantileBreaks } from "@/lib/national-style";
import { MAP_COLORS, PALETTE } from "@/lib/palette";
import type { ActiveRegion, GenericFeatureCollection, NationalFloods } from "@/types/data";

export interface ProvinceHover {
  pcode: string;
  name: string;
  floods: number | null;
  point: [number, number];
}

interface UseProvinceLayersOptions {
  map: MaplibreMap | null;
  provinces?: GenericFeatureCollection;
  floods?: NationalFloods;
  activeRegions?: readonly ActiveRegion[];
  visible: boolean;
  onHover?: (hover: ProvinceHover | null) => void;
  onSelectRegion?: (region: ActiveRegion) => void;
}

const SOURCE = "provinces";
const ACTIVE_SOURCE = "active-regions";
const LAYERS = ["provinces-fill", "provinces-line", "active-region-circle"] as const;

function emptyCollection(): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

function activeCollection(regions: readonly ActiveRegion[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: regions.map((region) => ({
      type: "Feature",
      properties: { region_id: region.region_id },
      geometry: { type: "Point", coordinates: region.center },
    })),
  };
}

function addLayers(map: MaplibreMap) {
  if (!map.getSource(SOURCE)) {
    map.addSource(SOURCE, { type: "geojson", data: emptyCollection(), promoteId: "pcode" });
  }
  if (!map.getSource(ACTIVE_SOURCE)) {
    map.addSource(ACTIVE_SOURCE, { type: "geojson", data: emptyCollection() });
  }
  addOrderedLayer(map, {
    id: "provinces-fill",
    type: "fill",
    source: SOURCE,
    paint: {
      "fill-color": [
        "match",
        ["to-number", ["feature-state", "cls"], -1],
        0,
        NATIONAL_SCALE[0],
        1,
        NATIONAL_SCALE[1],
        2,
        NATIONAL_SCALE[2],
        3,
        NATIONAL_SCALE[3],
        4,
        NATIONAL_SCALE[4],
        MAP_COLORS.provinceEmpty,
      ],
      "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.95, 0.8],
    },
  });
  addOrderedLayer(map, {
    id: "provinces-line",
    type: "line",
    source: SOURCE,
    paint: {
      "line-color": ["case", ["boolean", ["feature-state", "hover"], false], PALETTE.ink, PALETTE.surface],
      "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 1.6, 0.8],
    },
  });
  addOrderedLayer(map, {
    id: "active-region-circle",
    type: "circle",
    source: ACTIVE_SOURCE,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 7, 7, 12],
      "circle-color": PALETTE.brand,
      "circle-stroke-color": PALETTE.surface,
      "circle-stroke-width": 3,
    },
  });
}

function syncProvinces(map: MaplibreMap, data: ProvinceData) {
  addLayers(map);
  if (data.provinces) map.getSource<GeoJSONSource>(SOURCE)?.setData(data.provinces as GeoJSON.FeatureCollection);
  map.getSource<GeoJSONSource>(ACTIVE_SOURCE)?.setData(activeCollection(data.activeRegions ?? []));
  if (data.floods) {
    const breaks = quantileBreaks(data.floods.provinces.map((p) => p.floods));
    for (const province of data.floods.provinces) {
      map.setFeatureState({ source: SOURCE, id: province.pcode }, { cls: classIndex(province.floods, breaks) });
    }
  }
  setLayersVisible(map, LAYERS, data.visible);
}

interface ProvinceData {
  provinces?: GenericFeatureCollection;
  floods?: NationalFloods;
  activeRegions?: readonly ActiveRegion[];
  visible: boolean;
}

export function useProvinceLayers({
  map,
  provinces,
  floods,
  activeRegions,
  visible,
  onHover,
  onSelectRegion,
}: UseProvinceLayersOptions) {
  const data = useMemo(
    () => ({ provinces, floods, activeRegions, visible }),
    [provinces, floods, activeRegions, visible],
  );
  const dataRef = useRef(data);
  const callbacksRef = useRef({ onHover, onSelectRegion });
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    dataRef.current = data;
    callbacksRef.current = { onHover, onSelectRegion };
  });

  useStyleSync(map, data, syncProvinces);

  useEffect(() => {
    if (!map) return;
    const floodsByCode = () => new Map(dataRef.current.floods?.provinces.map((p) => [p.pcode, p.floods]));

    function setHover(id: string | null) {
      if (!map || hoveredRef.current === id) return;
      if (hoveredRef.current) map.setFeatureState({ source: SOURCE, id: hoveredRef.current }, { hover: false });
      hoveredRef.current = id;
      if (id) map.setFeatureState({ source: SOURCE, id }, { hover: true });
    }

    function handleMove(e: MapLayerMouseEvent) {
      const feature = e.features?.[0];
      if (!feature || feature.id === undefined) return;
      const pcode = String(feature.id);
      setHover(pcode);
      callbacksRef.current.onHover?.({
        pcode,
        name: String(feature.properties?.name ?? ""),
        floods: floodsByCode().get(pcode) ?? null,
        point: [e.point.x, e.point.y],
      });
    }

    function handleLeave() {
      setHover(null);
      callbacksRef.current.onHover?.(null);
    }

    function selectByProvince(pcode: string | undefined) {
      const regions = dataRef.current.activeRegions ?? [];
      const region = pcode === undefined ? regions[0] : regions.find((r) => r.province_pcode === pcode);
      if (region) callbacksRef.current.onSelectRegion?.(region);
    }

    function setCursor(cursor: string) {
      if (map) map.getCanvas().style.cursor = cursor;
    }

    const subscriptions = [
      map.on("mousemove", "provinces-fill", handleMove),
      map.on("mouseleave", "provinces-fill", handleLeave),
      map.on("click", "active-region-circle", () => selectByProvince(undefined)),
      map.on("click", "provinces-fill", (e) => {
        const id = e.features?.[0]?.id;
        if (id !== undefined) selectByProvince(String(id));
      }),
      map.on("mouseenter", "active-region-circle", () => setCursor("pointer")),
      map.on("mouseleave", "active-region-circle", () => setCursor("")),
    ];
    return () => subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [map]);
}
