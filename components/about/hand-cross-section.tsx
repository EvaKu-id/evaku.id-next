"use client";

import { useState } from "react";
import { WaterGauge } from "@/components/map/water-gauge";
import { RoadStatusLabel } from "@/components/ui/status";
import { formatDecimal, formatNumber } from "@/lib/format";
import { PALETTE } from "@/lib/palette";
import { DEFAULT_THRESHOLDS } from "@/lib/thresholds";
import type { RoadStatusCode } from "@/lib/status";

const WIDTH = 560;
const HEIGHT = 220;
const BASE = 190;
const PX_PER_M = 30;
const ROAD = { x: 170, hand: 0.9, label: "Jalan desa" };
const VILLAGE = { x: 420, hand: 2.6, label: "Permukiman" };

// Valley profile: x in px, height above the river (HAND) in metres.
const PROFILE: [number, number][] = [
  [0, 5.4], [60, 4.2], [110, 2.1], [150, 1.1], [190, 0.8], [230, 0.2], [262, 0], [298, 0], [330, 0.6], [380, 1.9], [440, 2.6], [500, 3.9], [560, 5.6],
];

const y = (hand: number) => BASE - hand * PX_PER_M;

function roadStatus(depthCm: number): RoadStatusCode {
  if (depthCm <= DEFAULT_THRESHOLDS.car_cm) return 0;
  return depthCm <= DEFAULT_THRESHOLDS.truck_cm ? 1 : 2;
}

export function HandCrossSection() {
  const [level, setLevel] = useState(1.2);
  const roadDepth = Math.max(0, (level - ROAD.hand) * 100);
  const villageDepth = Math.max(0, (level - VILLAGE.hand) * 100);
  const ground = `M0,${HEIGHT} ${PROFILE.map(([x, h]) => `L${x},${y(h)}`).join(" ")} L${WIDTH},${HEIGHT} Z`;
  const waterY = y(level);

  return (
    <div className="grid gap-6 rounded-[14px] border border-rule bg-surface p-5 sm:grid-cols-[1fr_auto]">
      <div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={`Penampang lembah dengan air ${formatDecimal(level)} meter di atas sungai`}>
          <defs>
            <clipPath id="valley-air">
              <path d={`M0,0 ${PROFILE.map(([x, h]) => `L${x},${y(h)}`).join(" ")} L${WIDTH},0 Z`} />
            </clipPath>
          </defs>
          <rect x="0" y={waterY} width={WIDTH} height={HEIGHT} fill={PALETTE.water1} clipPath="url(#valley-air)" />
          <line x1="0" x2={WIDTH} y1={waterY} y2={waterY} stroke={PALETTE.water3} strokeWidth="1.5" strokeDasharray="5 4" />
          <path d={ground} fill={PALETTE.brandSoft} stroke={PALETTE.ink} strokeWidth="1.2" />
          <rect x="262" y={BASE - 3} width="36" height="6" fill={PALETTE.water3} />
          <text x="280" y={BASE + 18} textAnchor="middle" fontSize="11" fill={PALETTE.muted}>sungai</text>
          {[ROAD, VILLAGE].map((item) => (
            <g key={item.label}>
              <line x1={item.x} x2={item.x} y1={y(item.hand)} y2={BASE} stroke={PALETTE.muted} strokeDasharray="2 3" />
              <circle cx={item.x} cy={y(item.hand)} r="5" fill={item === ROAD ? PALETTE.statusLimited : PALETTE.ink} stroke="var(--surface)" strokeWidth="2" />
              <text x={item.x} y={y(item.hand) - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill={PALETTE.ink}>{item.label}</text>
              <text x={item.x + 6} y={(y(item.hand) + BASE) / 2} fontSize="10" fill={PALETTE.muted}>HAND {formatDecimal(item.hand)} m</text>
            </g>
          ))}
          <text x={WIDTH - 8} y={waterY - 6} textAnchor="end" fontSize="11" fontWeight="600" fill={PALETTE.water3}>air {formatDecimal(level)} m</text>
        </svg>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] bg-surface-2 p-3">
            <p className="text-xs text-muted">Jalan desa · kedalaman {formatNumber(roadDepth)} cm</p>
            <div className="mt-1"><RoadStatusLabel status={roadStatus(roadDepth)} /></div>
          </div>
          <div className="rounded-[10px] bg-surface-2 p-3">
            <p className="text-xs text-muted">Permukiman · kedalaman {formatNumber(villageDepth)} cm</p>
            <p className="mt-1 text-sm font-semibold text-ink">{villageDepth > 0 ? "Rumah tergenang" : "Masih kering"}</p>
          </div>
        </div>
        <p className="mt-3 font-data text-sm text-ink">kedalaman = max(0, tinggi air − HAND)</p>
      </div>
      <div className="h-64 sm:h-auto">
        <p className="label-data mb-2">Tinggi air</p>
        <div className="h-[calc(100%-1.5rem)]">
          <WaterGauge value={level} onChange={setLevel} max={4} />
        </div>
      </div>
    </div>
  );
}
