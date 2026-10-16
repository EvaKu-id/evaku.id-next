import type { Metric } from "@/types/data";

export function metricValue(metrics: readonly Metric[] | undefined, model: string, name: string): number | null {
  return metrics?.find((metric) => metric.model === model && metric.name === name)?.value ?? null;
}

export function metricNote(metrics: readonly Metric[] | undefined, model: string, name: string): string | null {
  return metrics?.find((metric) => metric.model === model && metric.name === name)?.note ?? null;
}
