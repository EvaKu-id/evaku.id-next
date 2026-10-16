import type { RunVillage } from "@/types/data";
import type { BBox } from "@/types/map";

interface VillageDotMapProps {
  villages: readonly RunVillage[];
  bbox: BBox;
  colorOf: (village: RunVillage) => string;
  className?: string;
  label: string;
}

const WIDTH = 320;

// Plots village centres as dots; a light, data-only stand-in for a full map in small tiles.
export function VillageDotMap({ villages, bbox, colorOf, className, label }: VillageDotMapProps) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const midLat = ((minLat + maxLat) / 2) * (Math.PI / 180);
  const spanX = (maxLon - minLon) * Math.cos(midLat);
  const spanY = maxLat - minLat;
  const height = Math.round((WIDTH * spanY) / spanX);
  const x = (lon: number) => ((lon - minLon) * Math.cos(midLat) * WIDTH) / spanX;
  const y = (lat: number) => ((maxLat - lat) * height) / spanY;
  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} className={className} role="img" aria-label={label}>
      {villages.map((village) => (
        <circle key={village.village_id} cx={x(village.center[0])} cy={y(village.center[1])} r={4} fill={colorOf(village)} stroke="var(--surface)" strokeWidth={1} />
      ))}
    </svg>
  );
}
