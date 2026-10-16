import type { Map as MaplibreMap } from "maplibre-gl";
import { MAP_COLORS, PALETTE } from "@/lib/palette";

// Custom sources and layers are re-added on every style.load so they survive a style reload.
export function onStyleReady(map: MaplibreMap, apply: () => void): () => void {
  // A style fetched from a URL is attached asynchronously; isStyleLoaded() logs a warning before that.
  if (map.style && map.isStyleLoaded()) apply();
  map.on("style.load", apply);
  return () => {
    map.off("style.load", apply);
  };
}

// Tints the light Carto basemap toward the site's white-blue palette.
export function tintBasemap(map: MaplibreMap): void {
  const layers = map.getStyle().layers ?? [];
  for (const layer of layers) {
    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", PALETTE.bg);
    } else if (layer.type === "fill" && /water/i.test(layer.id)) {
      map.setPaintProperty(layer.id, "fill-color", MAP_COLORS.basemapWater);
    } else if (layer.type === "fill" && /landuse|park|wood|landcover/i.test(layer.id)) {
      map.setPaintProperty(layer.id, "fill-color", PALETTE.surface);
    }
  }
}
