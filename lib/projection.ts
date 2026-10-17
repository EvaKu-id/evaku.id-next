import type { BBox } from "@/types/map";

export interface Projector {
  width: number;
  height: number;
  x: (lon: number) => number;
  y: (lat: number) => number;
}

// Equirectangular projection scaled by cos(mid-latitude), enough for small SVG overviews.
export function createProjector([minLon, minLat, maxLon, maxLat]: BBox, width: number): Projector {
  const k = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
  const height = Math.round((width * (maxLat - minLat)) / ((maxLon - minLon) * k));
  return {
    width,
    height,
    x: (lon) => ((lon - minLon) / (maxLon - minLon)) * width,
    y: (lat) => ((maxLat - lat) / (maxLat - minLat)) * height,
  };
}
