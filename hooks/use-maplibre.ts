import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";
import {
  Map as MaplibreMap,
  NavigationControl,
  ScaleControl,
} from "maplibre-gl";
import { BASEMAP_STYLES } from "@/lib/map-config";
import { ensureMaplibreWorker } from "@/lib/maplibre-worker";
import type { BasemapTheme, MapViewState } from "@/types/map";

interface UseMapLibreOptions {
  initialView: MapViewState;
  theme: BasemapTheme;
}

interface UseMapLibreResult {
  containerRef: RefCallback<HTMLDivElement>;
  map: MaplibreMap | null;
}

export function useMapLibre(options: UseMapLibreOptions): UseMapLibreResult {
  const { theme } = options;
  const [map, setMap] = useState<MaplibreMap | null>(null);
  // Only the first options are used to create the map; theme changes go through setStyle below.
  const initialOptionsRef = useRef(options);
  const appliedThemeRef = useRef(theme);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;

    const { initialView, theme } = initialOptionsRef.current;
    ensureMaplibreWorker();
    const instance = new MaplibreMap({
      container,
      style: BASEMAP_STYLES[theme],
      center: initialView.center,
      zoom: initialView.zoom,
    });
    instance.addControl(new NavigationControl(), "top-right");
    instance.addControl(new ScaleControl(), "bottom-left");

    appliedThemeRef.current = theme;
    setMap(instance);

    return () => {
      instance.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!map || appliedThemeRef.current === theme) return;
    map.setStyle(BASEMAP_STYLES[theme]);
    appliedThemeRef.current = theme;
  }, [map, theme]);

  return { containerRef, map };
}
