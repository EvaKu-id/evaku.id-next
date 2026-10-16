import type { Metadata } from "next";
import { MapView } from "@/components/map";
import sampleRoads from "@/mocks/fixtures/public/roads.200.json";
import sampleVillages from "@/mocks/fixtures/public/villages.200.json";
import { publicRoadsResponse, publicVillagesResponse } from "@/contracts/public-api";

export const metadata: Metadata = {
  title: "Peta Monitoring Ruas | Evaku.id",
  description: "Visualisasi status ruas jalan dan desa terdampak banjir secara real-time.",
};

const roads = publicRoadsResponse.parse(sampleRoads);
const villages = publicVillagesResponse.parse(sampleVillages);

export default function MapPage() {
  return (
    <div className="w-full max-w-7xl mx-auto pt-4 pb-12">
      <MapView
        roads={roads}
        villages={villages}
        className="h-[calc(100vh-220px)] min-h-[520px] w-full"
      />
    </div>
  );
}
