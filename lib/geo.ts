import type { Geometry } from "geojson";
import type { BBox, LngLat } from "@/types/map";

const EARTH_RADIUS_M = 6_371_008.8;

export function haversineM([lon1, lat1]: LngLat, [lon2, lat2]: LngLat): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

function pathLength(points: readonly LngLat[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += haversineM(points[i - 1], points[i]);
  return total;
}

function asLngLat(position: readonly number[]): LngLat {
  return [position[0], position[1]];
}

// Vector tiles clip lines at tile edges, so this is the length visible in the clicked tile.
export function lineLengthM(geometry: Geometry): number | null {
  if (geometry.type === "LineString") return pathLength(geometry.coordinates.map(asLngLat));
  if (geometry.type === "MultiLineString") {
    return geometry.coordinates.reduce((sum, line) => sum + pathLength(line.map(asLngLat)), 0);
  }
  return null;
}

export function bboxOfPoints(points: readonly LngLat[]): BBox | null {
  if (points.length === 0) return null;
  let [minLon, minLat] = points[0];
  let [maxLon, maxLat] = points[0];
  for (const [lon, lat] of points) {
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  }
  return [minLon, minLat, maxLon, maxLat];
}
