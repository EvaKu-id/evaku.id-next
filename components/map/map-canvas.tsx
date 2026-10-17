"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePortalPopup } from "@/hooks/use-portal-popup";
import { useMapCamera, type CameraTarget } from "@/hooks/use-map-camera";
import { useFloodLayer, type FloodOverlay } from "@/hooks/use-flood-layer";
import { useMapLibre } from "@/hooks/use-maplibre";
import { usePlaceLayers, type SelectedPlace } from "@/hooks/use-place-layers";
import { useProvinceLayers, type ProvinceHover } from "@/hooks/use-province-layers";
import { useRoadLayers, type SelectedRoadInfo } from "@/hooks/use-road-layers";
import { useRouteLayer, type RouteOverlay } from "@/hooks/use-route-layer";
import { useVillageLayers } from "@/hooks/use-village-layers";
import { cn } from "@/lib/cn";
import type {
  ActiveRegion,
  EvacuationSites,
  GenericFeatureCollection,
  Hubs,
  NationalFloods,
  RoadState,
} from "@/types/data";
import type { BBox, MapLayersVisibility, MapViewState, VillageFill, VillageFillMode } from "@/types/map";

export interface NationalLayer {
  provinces?: GenericFeatureCollection;
  floods?: NationalFloods;
  activeRegions?: readonly ActiveRegion[];
  visible: boolean;
  onHover?: (hover: ProvinceHover | null) => void;
  onSelectRegion?: (region: ActiveRegion) => void;
}

export interface MapPopup {
  lngLat: [number, number];
  content: ReactNode;
  onClose: () => void;
}

export interface MapCanvasProps {
  popup?: MapPopup | null;
  initialView?: MapViewState;
  initialBounds?: BBox;
  camera?: CameraTarget | null;
  roads?: readonly RoadState[];
  villages?: readonly VillageFill[];
  villageMode?: VillageFillMode;
  selectedVillageId?: string | null;
  flood?: FloodOverlay | null;
  lowConfidence?: GenericFeatureCollection | null;
  sites?: EvacuationSites | null;
  hubs?: Hubs | null;
  route?: RouteOverlay;
  national?: NationalLayer;
  layers?: Partial<MapLayersVisibility>;
  interactive?: boolean;
  cooperativeGestures?: boolean;
  navigation?: boolean;
  preserveDrawingBuffer?: boolean;
  onSelectRoad?: (road: SelectedRoadInfo | null) => void;
  onSelectVillage?: (villageId: string) => void;
  onSelectPlace?: (place: SelectedPlace) => void;
  className?: string;
  label?: string;
}

function noop() {}

const NO_ROUTE: RouteOverlay = { route: null, villageCenter: null, evacuations: null };
const ALL_LAYERS: MapLayersVisibility = { roads: true, villages: true, flood: true, places: true, route: true };

export default function MapCanvas({
  popup = null,
  initialView,
  initialBounds,
  camera = null,
  roads,
  villages,
  villageMode = "status",
  selectedVillageId = null,
  flood = null,
  lowConfidence = null,
  sites = null,
  hubs = null,
  route = NO_ROUTE,
  national,
  layers,
  interactive = true,
  cooperativeGestures = false,
  navigation = true,
  preserveDrawingBuffer = false,
  onSelectRoad,
  onSelectVillage,
  onSelectPlace,
  className,
  label = "Peta interaktif",
}: MapCanvasProps) {
  const visible = { ...ALL_LAYERS, ...layers };
  const { containerRef, map } = useMapLibre({
    initialView,
    initialBounds,
    interactive,
    cooperativeGestures,
    navigation,
    preserveDrawingBuffer,
  });

  useProvinceLayers({
    map,
    provinces: national?.provinces,
    floods: national?.floods,
    activeRegions: national?.activeRegions,
    visible: national?.visible ?? false,
    onHover: national?.onHover,
    onSelectRegion: national?.onSelectRegion,
  });
  useVillageLayers({
    map,
    villages,
    mode: visible.villages ? villageMode : "none",
    selectedId: selectedVillageId,
    onSelectVillage,
  });
  useFloodLayer(map, flood, lowConfidence, visible.flood);
  useRoadLayers({ map, roads, visible: visible.roads, onSelectRoad });
  useRouteLayer(map, route, visible.route);
  usePlaceLayers(map, sites, hubs, visible.places, onSelectPlace);
  useMapCamera(map, camera);
  const popupNode = usePortalPopup(map, popup?.lngLat ?? null, popup?.onClose ?? noop);

  return (
    <>
      <div
        ref={containerRef}
        role="region"
        aria-label={label}
        data-lenis-prevent
        className={cn("size-full bg-surface-2", className)}
      />
      {popupNode && popup ? createPortal(popup.content, popupNode) : null}
    </>
  );
}
