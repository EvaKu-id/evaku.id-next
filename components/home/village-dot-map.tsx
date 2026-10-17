import { createProjector } from "@/lib/projection";
import type { RunVillage } from "@/types/data";
import type { BBox } from "@/types/map";

interface VillageDotMapProps {
  villages: readonly RunVillage[];
  bbox: BBox;
  colorOf: (village: RunVillage) => string;
  className?: string;
  label: string;
}


// Plots village centres as dots; a light, data-only stand-in for a full map in small tiles.
export function VillageDotMap({ villages, bbox, colorOf, className, label }: VillageDotMapProps) {
  const { width, height, x, y } = createProjector(bbox, 320);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={label}>
      {villages.map((village) => (
        <circle key={village.village_id} cx={x(village.center[0])} cy={y(village.center[1])} r={4} fill={colorOf(village)} stroke="var(--surface)" strokeWidth={1} />
      ))}
    </svg>
  );
}
