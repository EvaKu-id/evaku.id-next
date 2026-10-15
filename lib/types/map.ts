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
