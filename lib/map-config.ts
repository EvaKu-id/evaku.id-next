import type { BasemapTheme, MapViewState, VectorTileLayer } from "@/types/map";

const CARTO_GL_STYLES_URL = "https://basemaps.cartocdn.com/gl";

export const BASEMAP_STYLES: Record<BasemapTheme, string> = {
  light: `${CARTO_GL_STYLES_URL}/positron-gl-style/style.json`,
  dark: `${CARTO_GL_STYLES_URL}/dark-matter-gl-style/style.json`,
};

export const DEFAULT_VIEW: MapViewState = {
  center: [98.0, 4.21],
  zoom: 10,
};

// Tiles are served from public/ because r2.dev is blocked by some Indonesian ISPs.
const MAP_TILES_BASE_URL = process.env.NEXT_PUBLIC_MAP_TILES_BASE_URL ?? "/map";
export const MAP_DATA_VERSION =
  process.env.NEXT_PUBLIC_MAP_DATA_VERSION ?? "2026-10-16.3";

export type MapTileFile = "jalan.pmtiles" | "desa.pmtiles";

export function pmtilesUrl(file: MapTileFile): string {
  const base = MAP_TILES_BASE_URL.startsWith("http")
    ? MAP_TILES_BASE_URL
    : `${window.location.origin}${MAP_TILES_BASE_URL}`;
  return `pmtiles://${base}/${MAP_DATA_VERSION}/${file}`;
}

export const ROAD_TILES: VectorTileLayer = { source: "roads", sourceLayer: "ruas" };
export const VILLAGE_TILES: VectorTileLayer = { source: "villages", sourceLayer: "desa" };

export const MAP_ATTRIBUTION =
  "© OpenStreetMap contributors · Batas desa: BPS via OCHA HDX COD-AB (CC BY-IGO)";
