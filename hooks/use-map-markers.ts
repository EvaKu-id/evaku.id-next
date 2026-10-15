import { useEffect } from "react";
import { Marker, Popup, type Map as MaplibreMap } from "maplibre-gl";
import type { MapMarker } from "@/types/map";

const NO_MARKERS: readonly MapMarker[] = [];

export function useMapMarkers(
  map: MaplibreMap | null,
  markers: readonly MapMarker[] = NO_MARKERS,
): void {
  useEffect(() => {
    if (!map) return;

    const instances = markers.map(({ lngLat, label }) => {
      const marker = new Marker().setLngLat(lngLat);
      if (label) marker.setPopup(new Popup().setText(label));
      return marker.addTo(map);
    });

    return () => instances.forEach((marker) => marker.remove());
  }, [map, markers]);
}
