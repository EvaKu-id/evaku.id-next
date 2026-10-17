import type { Map as MaplibreMap, PointLike } from "maplibre-gl";

// Point markers sit above roads and villages; when one is under the cursor it owns hover and click.
export const POINT_LAYERS = ["evac-sites-circle", "hubs-circle", "route-points", "active-region-circle"] as const;

export function pointUnderCursor(map: MaplibreMap, point: PointLike): boolean {
  const layers = POINT_LAYERS.filter((id) => map.getLayer(id));
  return layers.length > 0 && map.queryRenderedFeatures(point, { layers: [...layers] }).length > 0;
}
