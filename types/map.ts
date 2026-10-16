export type BasemapTheme = "light" | "dark";

export type LngLat = [lng: number, lat: number];

export interface MapViewState {
  center: LngLat;
  zoom: number;
}

export interface MapMarker {
  lngLat: LngLat;
  label?: string;
}
git
export type RoadStatusCode = 0 | 1 | 2 | 3;

export type VillageAccessStatus =
  | "reachable"
  | "partially_isolated"
  | "fully_isolated";

export interface VillageAccess {
  village_id: string;
  status: VillageAccessStatus;
}

export interface VectorTileLayer {
  source: string;
  sourceLayer: string;
}
