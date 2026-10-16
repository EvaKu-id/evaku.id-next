import { NATIONAL_SCALE, PALETTE } from "@/lib/palette";

export { NATIONAL_SCALE };

// Quantile breaks so a few very large provinces do not flatten the rest of the map.
export function quantileBreaks(values: readonly number[], classes = NATIONAL_SCALE.length): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const breaks: number[] = [];
  for (let i = 1; i < classes; i += 1) {
    const value = sorted[Math.min(sorted.length - 1, Math.floor((i / classes) * sorted.length))];
    if (breaks.length === 0 || value > breaks[breaks.length - 1]) breaks.push(value);
  }
  return breaks;
}

export function classIndex(value: number, breaks: readonly number[]): number {
  let index = 0;
  for (const edge of breaks) if (value >= edge) index += 1;
  return Math.min(index, NATIONAL_SCALE.length - 1);
}

export const ACTIVE_REGION_COLOR = PALETTE.brand;
