import type { Metadata } from "next";
import { MapView } from "@/components/map";

export const metadata: Metadata = {
  title: "Peta | Evaku.id",
};

export default function MapPage() {
  return <MapView />;
}
