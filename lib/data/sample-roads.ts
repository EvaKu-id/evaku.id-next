export interface RoadFeatureProperties {
  edge_id: number;
  name: string;
  highway_type: string;
  is_bridge: boolean;
  length_m: number;
}

export interface RoadFeature {
  type: "Feature";
  id: number;
  properties: RoadFeatureProperties;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export interface RoadFeatureCollection {
  type: "FeatureCollection";
  features: RoadFeature[];
}

export const SAMPLE_ROADS_GEOJSON: RoadFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 71001,
      properties: {
        edge_id: 71001,
        name: "Jl. Raya Lubuk Minturun",
        highway_type: "primary",
        is_bridge: false,
        length_m: 2450,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.372, -0.835],
          [100.368, -0.839],
          [100.362, -0.843],
          [100.355, -0.845],
        ],
      },
    },
    {
      type: "Feature",
      id: 71002,
      properties: {
        edge_id: 71002,
        name: "Jl. Koto Panjang",
        highway_type: "secondary",
        is_bridge: false,
        length_m: 3120,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.355, -0.845],
          [100.348, -0.852],
          [100.342, -0.860],
          [100.350, -0.875],
        ],
      },
    },
    {
      type: "Feature",
      id: 71003,
      properties: {
        edge_id: 71003,
        name: "Jl. Air Dingin - Sungai Lareh",
        highway_type: "secondary",
        is_bridge: true,
        length_m: 1890,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.365, -0.820],
          [100.368, -0.827],
          [100.370, -0.831],
          [100.372, -0.835],
        ],
      },
    },
    {
      type: "Feature",
      id: 71004,
      properties: {
        edge_id: 71004,
        name: "Jl. Lingkar Dadok Tunggul Hitam",
        highway_type: "tertiary",
        is_bridge: false,
        length_m: 2780,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.350, -0.875],
          [100.358, -0.880],
          [100.365, -0.890],
          [100.365, -0.915],
        ],
      },
    },
    {
      type: "Feature",
      id: 71005,
      properties: {
        edge_id: 71005,
        name: "Jl. Akses Batipuh Panjang",
        highway_type: "tertiary",
        is_bridge: false,
        length_m: 1650,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.338, -0.840],
          [100.345, -0.842],
          [100.355, -0.845],
        ],
      },
    },
    {
      type: "Feature",
      id: 71006,
      properties: {
        edge_id: 71006,
        name: "Jl. Bungo Pasang Timur",
        highway_type: "residential",
        is_bridge: false,
        length_m: 1420,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.362, -0.860],
          [100.358, -0.855],
          [100.355, -0.845],
        ],
      },
    },
    {
      type: "Feature",
      id: 71007,
      properties: {
        edge_id: 71007,
        name: "Jl. Penghubung Balai Gadang",
        highway_type: "tertiary",
        is_bridge: false,
        length_m: 2100,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [100.385, -0.815],
          [100.375, -0.818],
          [100.365, -0.820],
        ],
      },
    },
  ],
};
