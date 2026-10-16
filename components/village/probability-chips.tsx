import { cn } from "@/lib/cn";
import { HORIZONS, PROBABILITY_LABELS, probabilityClass } from "@/lib/forecast";
import { formatPercent } from "@/lib/format";
import { PROBABILITY_COLORS } from "@/lib/status";
import type { ForecastRow, Horizon } from "@/types/data";

interface ProbabilityChipsProps {
  rows: readonly ForecastRow[];
  active?: Horizon;
}

export function ProbabilityChips({ rows, active }: ProbabilityChipsProps) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {HORIZONS.map((horizon) => {
        const row = rows.find((item) => item.horizon_hours === horizon);
        const cls = row ? probabilityClass(row.probability) : "low";
        return (
          <li
            key={horizon}
            className={cn("rounded-[10px] border bg-surface px-2.5 py-2", active === horizon ? "border-brand" : "border-rule")}
          >
            <p className="label-data">{horizon} jam</p>
            <p className="mt-0.5 flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: PROBABILITY_COLORS[cls] }} />
              <span className="font-data text-base font-semibold text-ink">{row ? formatPercent(row.probability) : "—"}</span>
            </p>
            <p className="text-[11px] text-muted">{PROBABILITY_LABELS[cls]}</p>
          </li>
        );
      })}
    </ul>
  );
}
