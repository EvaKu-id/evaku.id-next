import type { BasemapTheme, MapViewState } from "@/lib/types/map";

const CARTO_GL_STYLES_URL = "https://basemaps.cartocdn.com/gl";

export const BASEMAP_STYLES: Record<BasemapTheme, string> = {
  light: `${CARTO_GL_STYLES_URL}/positron-gl-style/style.json`,
  dark: `${CARTO_GL_STYLES_URL}/dark-matter-gl-style/style.json`,
};

export const DEFAULT_VIEW: MapViewState = {
  center: [100.36, -0.845],
  zoom: 12.5,
};
