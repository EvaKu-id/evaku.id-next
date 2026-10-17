import { PALETTE } from "@/lib/palette";
import type { ProbabilityClass } from "@/lib/forecast";
import type { VillageStatus } from "@/types/data";

export type RoadStatusCode = 0 | 1 | 2 | 3;

export const ROAD_STATUS: Record<RoadStatusCode, { label: string; description: string; color: string; dashed: boolean }> = {
  0: { label: "Aman", description: "Bisa dilewati", color: PALETTE.statusSafe, dashed: false },
  1: { label: "Terbatas", description: "Hanya truk atau 4x4", color: PALETTE.statusLimited, dashed: false },
  2: { label: "Putus", description: "Tidak bisa dilewati", color: PALETTE.statusCut, dashed: true },
  3: { label: "Belum diketahui", description: "Tidak tercakup citra", color: PALETTE.statusUnknown, dashed: false },
};

export const ROAD_STATUS_CODES: readonly RoadStatusCode[] = [0, 1, 2, 3];

export const VILLAGE_STATUS: Record<VillageStatus, { label: string; short: string; color: string }> = {
  reachable: { label: "Terjangkau", short: "Terjangkau", color: PALETTE.statusSafe },
  partially_isolated: { label: "Terisolasi sebagian", short: "Sebagian", color: PALETTE.statusLimited },
  fully_isolated: { label: "Terisolasi total", short: "Total", color: PALETTE.statusCut },
};

export const PROBABILITY_COLORS: Record<ProbabilityClass, string> = {
  low: PALETTE.probLow,
  mid: PALETTE.probMid,
  high: PALETTE.probHigh,
};

export const FLOOD_CLASSES = [
  { key: "shallow", label: "Dangkal", range: "< 30 cm", color: PALETTE.water1 },
  { key: "medium", label: "Sedang", range: "30–60 cm", color: PALETTE.water2 },
  { key: "deep", label: "Dalam", range: "> 60 cm", color: PALETTE.water3 },
] as const;

export function isRoadStatusCode(value: number): value is RoadStatusCode {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

const HIGHWAY_LABELS: Record<string, string> = {
  motorway: "Jalan tol",
  trunk: "Jalan nasional",
  primary: "Jalan provinsi",
  secondary: "Jalan kabupaten",
  tertiary: "Jalan penghubung",
  unclassified: "Jalan desa",
  residential: "Jalan permukiman",
  track: "Jalan tanah",
  service: "Jalan akses",
};

export function highwayLabel(highwayType: string): string {
  return HIGHWAY_LABELS[highwayType.replace(/_link$/, "")] ?? "Jalan";
}
