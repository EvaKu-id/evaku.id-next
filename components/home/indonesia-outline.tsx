"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveRegions, useProvinces } from "@/hooks/use-data";
import { INDONESIA_BOUNDS } from "@/lib/map-config";

const WIDTH = 1000;

type Ring = number[][];

function isRing(value: unknown): value is Ring {
  return Array.isArray(value) && value.every((point) => Array.isArray(point) && typeof point[0] === "number");
}

function polygonsOf(geometry: { type: string; coordinates: unknown }): Ring[][] {
  const coords = geometry.coordinates;
  if (!Array.isArray(coords)) return [];
  if (geometry.type === "Polygon") return [coords.filter(isRing)];
  if (geometry.type === "MultiPolygon") return coords.filter(Array.isArray).map((poly: unknown[]) => poly.filter(isRing));
  return [];
}

export function IndonesiaOutline() {
  const provinces = useProvinces();
  const regions = useActiveRegions();
  const [minLon, minLat, maxLon, maxLat] = INDONESIA_BOUNDS;
  const k = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
  const height = Math.round((WIDTH * (maxLat - minLat)) / ((maxLon - minLon) * k));
  const x = (lon: number) => (((lon - minLon) * k) / ((maxLon - minLon) * k)) * WIDTH;
  const y = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * height;
  const activeCodes = new Set((regions.data ?? []).map((region) => region.province_pcode));

  const paths = useMemo(
    () =>
      (provinces.data?.features ?? []).map((feature, index) => {
        const d = polygonsOf(feature.geometry)
          .flatMap((polygon) => polygon.map((ring) => `M${ring.map(([lon, lat]) => `${x(lon).toFixed(1)},${y(lat).toFixed(1)}`).join("L")}Z`))
          .join("");
        return { d, pcode: String(feature.properties?.pcode ?? index) };
      }),
    // Projection constants are fixed; recompute only when the data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provinces.data],
  );

  if (!provinces.data) return <Skeleton className="aspect-[2.4/1] w-full" />;
  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full" role="img" aria-label="Peta 34 provinsi Indonesia dengan wilayah aktif EvaKu ditandai">
      {paths.map((path) => (
        <path
          key={path.pcode}
          d={path.d}
          fill={activeCodes.has(path.pcode) ? "var(--brand-soft)" : "var(--surface)"}
          stroke={activeCodes.has(path.pcode) ? "var(--brand)" : "var(--status-safe)"}
          strokeWidth={activeCodes.has(path.pcode) ? 1.4 : 0.7}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {(regions.data ?? []).map((region) => (
        <g key={region.region_id}>
          <circle cx={x(region.center[0])} cy={y(region.center[1])} r={14} fill="var(--brand)" opacity={0.18} />
          <circle cx={x(region.center[0])} cy={y(region.center[1])} r={6} fill="var(--brand)" stroke="var(--surface)" strokeWidth={2} />
          <text x={x(region.center[0]) + 14} y={y(region.center[1]) - 12} fontSize={18} fontWeight={700} fill="var(--ink)">
            {region.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
