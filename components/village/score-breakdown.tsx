import { formatDecimal, formatPercent } from "@/lib/format";
import { SCORE_LABELS, scoredComponents } from "@/lib/scoring";
import type { ScoreItem } from "@/types/data";

interface ScoreBreakdownProps {
  items: readonly ScoreItem[] | null;
  score: number | null;
}

export function ScoreBreakdown({ items, score }: ScoreBreakdownProps) {
  if (!items || score === null) {
    return <p className="text-sm text-ink-2">Desa terjangkau, tidak masuk ranking prioritas.</p>;
  }
  const byComponent = new Map(items.map((item) => [item.component, item]));
  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-data text-3xl font-semibold text-ink">{formatDecimal(score * 100)}</span>
        <span className="text-sm text-muted">skor prioritas dari 100</span>
      </p>
      <ul className="mt-3 space-y-2">
        {scoredComponents([items]).map((component) => {
          const item = byComponent.get(component);
          const value = item?.value ?? 0;
          const weight = item?.weight ?? 0;
          return (
            <li key={component}>
              <div className="flex justify-between text-xs">
                <span className="text-ink-2">
                  {SCORE_LABELS[component]} <span className="text-muted">· bobot {formatPercent(weight)}</span>
                </span>
                <span className="font-data text-ink">{formatDecimal(value * weight * 100)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round(value * 100)}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
