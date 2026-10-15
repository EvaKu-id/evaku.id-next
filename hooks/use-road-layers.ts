"use client";

import { useEffect, useRef } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { SAMPLE_ROADS_GEOJSON } from "@/lib/data/sample-roads";
import type { RoadStatus } from "@/lib/schemas/roads";

export interface SelectedRoadInfo {
  edge_id: number;
  name: string;
  status: number;
  depth_cm: number | null;
  lngLat?: [number, number];
}

interface UseRoadLayersOptions {
  map: MaplibreMap | null;
  roads?: readonly RoadStatus[];
  onSelectRoad?: (road: SelectedRoadInfo | null) => void;
}

export function useRoadLayers({
  map,
  roads,
  onSelectRoad,
}: UseRoadLayersOptions) {
  const hoveredIdRef = useRef<number | string | null>(null);
  const onSelectRoadRef = useRef(onSelectRoad);

  useEffect(() => {
    onSelectRoadRef.current = onSelectRoad;
  }, [onSelectRoad]);

  // 1. Tambah source & layers ke peta MapLibre
  useEffect(() => {
    if (!map) return;

    function addRoadLayers() {
      if (!map) return;

      // Cek apakah source 'roads' sudah ada
      if (!map.getSource("roads")) {
        map.addSource("roads", {
          type: "geojson",
          data: SAMPLE_ROADS_GEOJSON as unknown as GeoJSON.GeoJSON,
          promoteId: "edge_id",
        });
      }

      // Casing / Bayangan garis jalan untuk kontras tinggi
      if (!map.getLayer("roads-casing")) {
        map.addLayer({
          id: "roads-casing",
          type: "line",
          source: "roads",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#000000",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              4,
              12,
              6,
              15,
              9,
            ],
            "line-opacity": 0.22,
          },
        });
      }

      // Garis utama dengan warna dari feature-state
      // Palet ramah buta warna:
      // 0 = Aman (#059669 - Emerald)
      // 1 = Terbatas (#d97706 - Amber)
      // 2 = Putus (#e11d48 - Rose/Red)
      // 3 = Belum diketahui (#64748b - Slate)
      if (!map.getLayer("roads-line")) {
        map.addLayer({
          id: "roads-line",
          type: "line",
          source: "roads",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#0284c7", // Sky blue saat hover
              [
                "match",
                ["to-number", ["feature-state", "status"]],
                0,
                "#059669",
                1,
                "#d97706",
                2,
                "#e11d48",
                3,
                "#64748b",
                "#10b981", // Fallback default
              ],
            ],
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              ["case", ["boolean", ["feature-state", "hover"], false], 4.5, 3],
              12,
              ["case", ["boolean", ["feature-state", "hover"], false], 6, 4.5],
              15,
              ["case", ["boolean", ["feature-state", "hover"], false], 8, 6],
            ],
          },
        });
      }

      // Garis putus-putus khusus untuk status Putus (status = 2)
      // Membantu penderita buta warna mengenali status putus tanpa melihat warna
      if (!map.getLayer("roads-cut-dash")) {
        map.addLayer({
          id: "roads-cut-dash",
          type: "line",
          source: "roads",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              1.5,
              12,
              2,
              15,
              3,
            ],
            "line-dasharray": [2, 2],
            "line-opacity": [
              "case",
              ["==", ["to-number", ["feature-state", "status"]], 2],
              0.95,
              0,
            ],
          },
        });
      }

      // Event listener: Hover
      map.on("mousemove", "roads-line", (e) => {
        if (!e.features || !e.features[0]) return;
        map.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];
        const id = feature.id ?? feature.properties?.edge_id;

        if (hoveredIdRef.current !== id) {
          if (hoveredIdRef.current !== null) {
            map.setFeatureState(
              { source: "roads", id: hoveredIdRef.current },
              { hover: false }
            );
          }
          if (id !== undefined) {
            hoveredIdRef.current = id;
            map.setFeatureState({ source: "roads", id }, { hover: true });
          }
        }
      });

      map.on("mouseleave", "roads-line", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: "roads", id: hoveredIdRef.current },
            { hover: false }
          );
          hoveredIdRef.current = null;
        }
      });

      // Event listener: Klik ruas untuk menampilkan detail
      map.on("click", "roads-line", (e) => {
        if (!e.features || !e.features[0]) return;
        const feature = e.features[0];
        const edgeId = Number(feature.id ?? feature.properties?.edge_id);
        const name =
          feature.properties?.name || `Ruas #${edgeId}`;
        const state = map.getFeatureState({ source: "roads", id: edgeId });
        const status = typeof state.status === "number" ? state.status : 0;
        const depth_cm =
          typeof state.depth_cm === "number" ? state.depth_cm : null;

        onSelectRoadRef.current?.({
          edge_id: edgeId,
          name,
          status,
          depth_cm,
          lngLat: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    if (map.isStyleLoaded()) {
      addRoadLayers();
    } else {
      map.once("load", addRoadLayers);
      map.once("styledata", addRoadLayers);
    }
  }, [map]);

  // 2. Terapkan setFeatureState per edge_id secara dinamis saat data roads berubah
  useEffect(() => {
    if (!map || !roads || roads.length === 0) return;

    function applyRoadStates() {
      if (!map || !map.getSource("roads")) return;

      roads?.forEach((road) => {
        try {
          map.setFeatureState(
            { source: "roads", id: road.edge_id },
            {
              status: road.status,
              depth_cm: road.depth_cm ?? 0,
            }
          );
        } catch {
          // Abaikan jika source belum siap di frame ini
        }
      });
    }

    if (map.isStyleLoaded()) {
      applyRoadStates();
    } else {
      map.once("styledata", applyRoadStates);
    }
  }, [map, roads]);
}
