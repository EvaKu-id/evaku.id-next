"use client";

import { useMemo } from "react";
import type { GeoJSONSource, ImageSource, Map as MaplibreMap } from "maplibre-gl";
import { useStyleSync } from "@/hooks/use-style-sync";
import { addOrderedLayer, setLayersVisible } from "@/lib/map-order";
import { PALETTE } from "@/lib/palette";
import type { GenericFeatureCollection } from "@/types/data";

export interface FloodOverlay {
  url: string;
  coordinates: [[number, number], [number, number], [number, number], [number, number]];
}

interface FloodData {
  overlay: FloodOverlay | null;
  lowConfidence: GenericFeatureCollection | null;
  visible: boolean;
}

const IMAGE_SOURCE = "flood";
const LOW_SOURCE = "low-confidence";

function syncFlood(map: MaplibreMap, { overlay, lowConfidence, visible }: FloodData) {
  const image = map.getSource<ImageSource>(IMAGE_SOURCE);
  if (overlay) {
    if (!image) {
      map.addSource(IMAGE_SOURCE, { type: "image", url: overlay.url, coordinates: overlay.coordinates });
    } else {
      image.updateImage({ url: overlay.url, coordinates: overlay.coordinates });
    }
    addOrderedLayer(map, {
      id: "flood-raster",
      type: "raster",
      source: IMAGE_SOURCE,
      paint: { "raster-opacity": 0.85, "raster-fade-duration": 200, "raster-resampling": "nearest" },
    });
  }

  if (!map.getSource(LOW_SOURCE)) {
    map.addSource(LOW_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
  }
  if (lowConfidence) map.getSource<GeoJSONSource>(LOW_SOURCE)?.setData(lowConfidence as GeoJSON.FeatureCollection);
  addOrderedLayer(map, {
    id: "low-confidence-fill",
    type: "line",
    source: LOW_SOURCE,
    paint: { "line-color": PALETTE.ink, "line-width": 1.2, "line-dasharray": [1, 1.5], "line-opacity": 0.55 },
  });

  setLayersVisible(map, ["flood-raster"], visible && overlay !== null);
  setLayersVisible(map, ["low-confidence-fill"], visible && lowConfidence !== null);
}

export function useFloodLayer(
  map: MaplibreMap | null,
  overlay: FloodOverlay | null,
  lowConfidence: GenericFeatureCollection | null,
  visible: boolean,
) {
  const data = useMemo(() => ({ overlay, lowConfidence, visible }), [overlay, lowConfidence, visible]);
  useStyleSync(map, data, syncFlood);
}
