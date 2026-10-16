import type { ScoreComponent, ScoreItem } from "@/types/data";

export type ScoreWeights = Record<ScoreComponent, number>;

export const DEFAULT_WEIGHTS: ScoreWeights = {
  isolated_population: 0.35,
  vulnerable_share: 0.2,
  no_health_facility: 0.2,
  isolation_duration: 0.15,
  access_difficulty: 0.1,
};

export const SCORE_COMPONENTS: readonly ScoreComponent[] = [
  "isolated_population",
  "vulnerable_share",
  "no_health_facility",
  "isolation_duration",
  "access_difficulty",
];

export const SCORE_LABELS: Record<ScoreComponent, string> = {
  isolated_population: "Warga terisolasi",
  vulnerable_share: "Porsi balita & lansia",
  no_health_facility: "Tanpa akses faskes",
  isolation_duration: "Lama terisolasi",
  access_difficulty: "Kesulitan akses",
};

export function weightsTotal(weights: ScoreWeights): number {
  return SCORE_COMPONENTS.reduce((sum, key) => sum + weights[key], 0);
}

// A component the engine has no data for comes with weight 0; like the engine, its weight is
// shared out over the remaining components instead of counting as zero.
export function rescore(breakdown: readonly ScoreItem[], weights: ScoreWeights): number {
  const used = breakdown.filter((item) => item.weight > 0);
  const total = used.reduce((sum, item) => sum + weights[item.component], 0);
  if (total <= 0) return 0;
  const score = used.reduce((sum, item) => sum + item.value * weights[item.component], 0);
  return Math.min(1, Math.max(0, score / total));
}

// Components the engine scored for at least one village; the rest have no source data yet.
export function scoredComponents(breakdowns: readonly (readonly ScoreItem[] | null | undefined)[]): ScoreComponent[] {
  const used = new Set<ScoreComponent>();
  for (const items of breakdowns) for (const item of items ?? []) if (item.weight > 0) used.add(item.component);
  return used.size === 0 ? [...SCORE_COMPONENTS] : SCORE_COMPONENTS.filter((component) => used.has(component));
}
