"use client";

import { useEffect, useRef } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import type { BBox, LngLat } from "@/types/map";

export type CameraTarget =
  | { kind: "bounds"; bbox: BBox; padding?: number; key: string }
  | { kind: "point"; center: LngLat; zoom: number; key: string };

// Moves the camera only when the target key changes, so re-renders never fight the user's panning.
export function useMapCamera(map: MaplibreMap | null, target: CameraTarget | null) {
  const lastKey = useRef<string | null>(null);
  useEffect(() => {
    if (!map || !target || lastKey.current === target.key) return;
    lastKey.current = target.key;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target.kind === "bounds") {
      map.fitBounds(target.bbox, { padding: target.padding ?? 40, duration: reduced ? 0 : 900 });
    } else {
      map.flyTo({ center: target.center, zoom: target.zoom, duration: reduced ? 0 : 900, essential: true });
    }
  }, [map, target]);
}
