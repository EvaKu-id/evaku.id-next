"use client";

import { useEffect, useMemo } from "react";
import { Popup, type GeoJSONSource, type Map as MaplibreMap, type MapLayerMouseEvent } from "maplibre-gl";
import { useStyleSync } from "@/hooks/use-style-sync";
import { addOrderedLayer, setLayersVisible } from "@/lib/map-order";
import { PALETTE } from "@/lib/palette";
import type { EvacuationSites, Hubs } from "@/types/data";

interface PlaceData {
  sites: EvacuationSites | null;
  hubs: Hubs | null;
  visible: boolean;
}

const EMPTY: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

function syncPlaces(map: MaplibreMap, { sites, hubs, visible }: PlaceData) {
  if (!map.getSource("evac-sites")) map.addSource("evac-sites", { type: "geojson", data: EMPTY });
  if (!map.getSource("hubs")) map.addSource("hubs", { type: "geojson", data: EMPTY });
  if (sites) map.getSource<GeoJSONSource>("evac-sites")?.setData(sites as GeoJSON.FeatureCollection);
  if (hubs) map.getSource<GeoJSONSource>("hubs")?.setData(hubs as GeoJSON.FeatureCollection);

  addOrderedLayer(map, {
    id: "evac-sites-circle",
    type: "circle",
    source: "evac-sites",
    minzoom: 9,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 2.5, 13, 5],
      "circle-color": PALETTE.surface,
      "circle-stroke-color": PALETTE.site,
      "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 9, 1.2, 13, 2],
    },
  });
  addOrderedLayer(map, {
    id: "hubs-circle",
    type: "circle",
    source: "hubs",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 4, 13, 7],
      "circle-color": PALETTE.ink,
      "circle-stroke-color": PALETTE.surface,
      "circle-stroke-width": 2,
    },
  });
  setLayersVisible(map, ["evac-sites-circle", "hubs-circle"], visible);
}

export function usePlaceLayers(
  map: MaplibreMap | null,
  sites: EvacuationSites | null,
  hubs: Hubs | null,
  visible: boolean,
) {
  const data = useMemo(() => ({ sites, hubs, visible }), [sites, hubs, visible]);
  useStyleSync(map, data, syncPlaces);

  useEffect(() => {
    if (!map) return;
    const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 10, className: "evaku-tip" });

    function show(prefix: string) {
      return (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point" || !map) return;
        map.getCanvas().style.cursor = "pointer";
        const [lon, lat] = feature.geometry.coordinates;
        popup
          .setLngLat([lon, lat])
          .setHTML(
            `<div class="px-3 py-2 text-xs"><p class="label-data">${prefix}</p><p class="font-semibold text-ink">${escapeHtml(String(feature.properties?.name ?? ""))}</p></div>`,
          )
          .addTo(map);
      };
    }

    function hide() {
      if (!map) return;
      map.getCanvas().style.cursor = "";
      popup.remove();
    }

    const subscriptions = [
      map.on("mousemove", "evac-sites-circle", show("Kandidat lokasi evakuasi")),
      map.on("mouseleave", "evac-sites-circle", hide),
      map.on("mousemove", "hubs-circle", show("Posko logistik")),
      map.on("mouseleave", "hubs-circle", hide),
    ];
    return () => {
      popup.remove();
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [map]);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
