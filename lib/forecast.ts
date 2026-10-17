import type { Horizon } from "@/types/data";

export const HORIZONS: readonly Horizon[] = [24, 48, 72];

export const PROBABILITY_THRESHOLDS = { mid: 0.35, high: 0.7 } as const;

export type ProbabilityClass = "low" | "mid" | "high";

export const PROBABILITY_CLASSES: readonly ProbabilityClass[] = ["low", "mid", "high"];

export function probabilityClass(probability: number): ProbabilityClass {
  if (probability >= PROBABILITY_THRESHOLDS.high) return "high";
  if (probability >= PROBABILITY_THRESHOLDS.mid) return "mid";
  return "low";
}

export const PROBABILITY_LABELS: Record<ProbabilityClass, string> = {
  low: "Rendah",
  mid: "Sedang",
  high: "Tinggi",
};

export function cutoffLabel(cutoffHour: number | null): string {
  return cutoffHour === null ? "Tidak diperkirakan putus" : `Putus dalam ±${cutoffHour} jam`;
}

export function isHorizon(value: number): value is Horizon {
  return value === 24 || value === 48 || value === 72;
}
