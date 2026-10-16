import type { Map as MaplibreMap } from "maplibre-gl";

// setStyle (theme switch) drops custom sources and layers, so they are added again on every style.load.
export function onStyleReady(map: MaplibreMap, apply: () => void): () => void {
  // A style fetched from a URL is attached asynchronously; isStyleLoaded() logs a warning before that.
  if (map.style && map.isStyleLoaded()) apply();
  map.on("style.load", apply);
  return () => {
    map.off("style.load", apply);
  };
}
