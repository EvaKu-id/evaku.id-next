"use client";

import { useCallback, useRef, useState, type RefCallback } from "react";
import {
  AttributionControl,
  Map as MaplibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import { BASEMAP_STYLE, MAP_ATTRIBUTION } from "@/lib/map-config";
import { onStyleReady, tintBasemap } from "@/lib/map-style";
import { ensureMaplibreWorker } from "@/lib/maplibre-worker";
import type { BBox, MapViewState } from "@/types/map";

interface UseMapLibreOptions {
  initialView?: MapViewState;
  initialBounds?: BBox;
  interactive?: boolean;
  cooperativeGestures?: boolean;
  navigation?: boolean;
  preserveDrawingBuffer?: boolean;
}

interface UseMapLibreResult {
  containerRef: RefCallback<HTMLDivElement>;
  map: MaplibreMap | null;
}

export function useMapLibre(options: UseMapLibreOptions): UseMapLibreResult {
  const [map, setMap] = useState<MaplibreMap | null>(null);
  // Only the first options are used; the map is created once per container.
  const optionsRef = useRef(options);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    const {
      initialView,
      initialBounds,
      interactive = true,
      cooperativeGestures = false,
      navigation = true,
      preserveDrawingBuffer = false,
    } = optionsRef.current;

    ensureMaplibreWorker();
    const instance = new MaplibreMap({
      container,
      style: BASEMAP_STYLE,
      center: initialView?.center,
      zoom: initialView?.zoom,
      bounds: initialBounds,
      fitBoundsOptions: { padding: 24 },
      interactive,
      cooperativeGestures,
      attributionControl: false,
      canvasContextAttributes: { preserveDrawingBuffer },
      dragRotate: false,
      pitchWithRotate: false,
    });
    instance.touchZoomRotate.disableRotation();
    instance.addControl(new AttributionControl({ compact: true, customAttribution: MAP_ATTRIBUTION }));
    if (interactive && navigation) {
      instance.addControl(new NavigationControl({ showCompass: false }), "top-right");
      instance.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
    }
    const stopTint = onStyleReady(instance, () => tintBasemap(instance));

    setMap(instance);
    return () => {
      stopTint();
      instance.remove();
      setMap(null);
    };
  }, []);

  return { containerRef, map };
}
