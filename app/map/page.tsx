import type { Metadata } from "next";
import { MapView } from "@/components/map";
import sampleRoads from "@/mocks/fixtures/public/roads.200.json";
import type { MapMarker } from "@/lib/types/map";
import type { RoadStatus } from "@/lib/schemas/roads";

export const metadata: Metadata = {
  title: "Peta Monitoring Ruas | Evaku.id",
  description: "Visualisasi status ruas jalan dan desa terdampak banjir secara real-time.",
};

const sampleMarkers: MapMarker[] = [
  { lngLat: [100.372, -0.835], label: "Lubuk Minturun" },
  { lngLat: [100.355, -0.845], label: "Koto Panjang Ikur Koto" },
  { lngLat: [100.365, -0.82], label: "Air Dingin" },
  { lngLat: [100.35, -0.875], label: "Dadok Tunggul Hitam" },
];

export default function MapPage() {
  return (
    <div className="w-full max-w-7xl mx-auto pt-4 pb-12">
      <MapView
        roads={sampleRoads as RoadStatus[]}
        markers={sampleMarkers}
        className="h-[calc(100vh-220px)] min-h-[520px] w-full"
      />
    </div>
  );
}
