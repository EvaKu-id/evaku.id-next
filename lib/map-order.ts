import type { AddLayerObject, Map as MaplibreMap } from "maplibre-gl";

// Bottom-to-top order of every custom layer. Layers are inserted below the first already-present
// layer that should sit above them, so hooks can add layers in any order.
export const LAYER_ORDER = [
  "provinces-fill",
  "provinces-line",
  "villages-fill",
  "flood-raster",
  "low-confidence-fill",
  "villages-line",
  "villages-selected",
  "roads-path",
  "roads-minor",
  "roads-major",
  "roads-path-cut",
  "roads-minor-cut",
  "roads-major-cut",
  "evac-route-line",
  "route-line-casing",
  "route-line",
  "route-boat",
  "hubs-circle",
  "evac-sites-circle",
  "route-points",
  "active-region-circle",
] as const;

export type OrderedLayerId = (typeof LAYER_ORDER)[number];

export function addOrderedLayer(map: MaplibreMap, layer: AddLayerObject & { id: OrderedLayerId }): void {
  if (map.getLayer(layer.id)) return;
  const index = LAYER_ORDER.indexOf(layer.id);
  const before = LAYER_ORDER.slice(index + 1).find((id) => map.getLayer(id));
  map.addLayer(layer, before);
}

export function setLayersVisible(map: MaplibreMap, ids: readonly OrderedLayerId[], visible: boolean): void {
  for (const id of ids) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
  }
}
