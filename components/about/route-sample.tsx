import { Ornament } from "@/components/ui/ornament";
import { MapFrame } from "@/components/ui/map-frame";

export function RouteSample() {
  return (
    <MapFrame title="Rute nyata · posko → titik perahu → desa" bodyClassName="h-72 bg-surface-2">
      <Ornament name="contours" className="absolute inset-0 text-brand/10" />
      <Ornament name="route-sample" className="absolute inset-6 text-brand" />
    </MapFrame>
  );
}
