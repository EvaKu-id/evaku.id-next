export type LngLat = [lng: number, lat: number];

export type BBox = [minLon: number, minLat: number, maxLon: number, maxLat: number];

export interface MapViewState {
  center: LngLat;
  zoom: number;
}

export type RoadStatusCode = 0 | 1 | 2 | 3;

export type VillageAccessStatus = "reachable" | "partially_isolated" | "fully_isolated";

export interface VillageAccess {
  village_id: string;
  status: VillageAccessStatus;
}

export type ReplayCategory = "tp" | "fp" | "fn" | "tn";

export interface VillageFill {
  village_id: string;
  status: VillageAccessStatus;
  probability?: number | null;
  category?: ReplayCategory;
}

export interface VectorTileLayer {
  source: string;
  sourceLayer: string;
}

export type VillageFillMode = "status" | "probability" | "category" | "none";

export interface MapLayersVisibility {
  roads: boolean;
  villages: boolean;
  flood: boolean;
  places: boolean;
  route: boolean;
}
