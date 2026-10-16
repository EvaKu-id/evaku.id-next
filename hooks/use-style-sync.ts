"use client";

import { useEffect, useRef } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { onStyleReady } from "@/lib/map-style";

// Applies `value` to the map once the style is ready, again after every style reload, and on
// every change of `value`. Callers memoise `value` so unrelated renders do not re-apply it.
export function useStyleSync<T>(
  map: MaplibreMap | null,
  value: T,
  apply: (map: MaplibreMap, value: T) => void,
): void {
  const valueRef = useRef(value);
  const applyRef = useRef(apply);
  const readyRef = useRef(false);

  useEffect(() => {
    applyRef.current = apply;
  });

  useEffect(() => {
    if (!map) return;
    const stop = onStyleReady(map, () => {
      readyRef.current = true;
      applyRef.current(map, valueRef.current);
    });
    return () => {
      readyRef.current = false;
      stop();
    };
  }, [map]);

  useEffect(() => {
    valueRef.current = value;
    if (map && readyRef.current) applyRef.current(map, value);
  }, [map, value]);
}
