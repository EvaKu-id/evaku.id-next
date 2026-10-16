import { DEFAULT_WEIGHTS, SCORE_COMPONENTS, SCORE_LABELS } from "@/lib/scoring";
import { formatPercent } from "@/lib/format";
import { PALETTE, WEIGHT_SHADES as SHADES } from "@/lib/palette";


export function WeightsBar() {
  return (
    <div>
      <div className="flex h-10 overflow-hidden rounded-[8px]" role="img" aria-label="Bobot skor prioritas">
        {SCORE_COMPONENTS.map((component, index) => (
          <div
            key={component}
            className="flex items-center justify-center border-r-2 border-surface font-data text-xs font-semibold last:border-r-0"
            style={{ width: `${DEFAULT_WEIGHTS[component] * 100}%`, backgroundColor: SHADES[index], color: index < 2 ? PALETTE.surface : PALETTE.ink }}
          >
            {formatPercent(DEFAULT_WEIGHTS[component])}
          </div>
        ))}
      </div>
      <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
        {SCORE_COMPONENTS.map((component, index) => (
          <li key={component} className="flex items-center gap-2 text-ink-2">
            <span aria-hidden className="size-3 rounded-[3px]" style={{ backgroundColor: SHADES[index] }} />
            {SCORE_LABELS[component]}
            <span className="ml-auto font-data text-ink">{formatPercent(DEFAULT_WEIGHTS[component])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
