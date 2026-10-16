import { CircleAlert, CircleCheck, CircleSlash, Ban } from "lucide-react";
import { cn } from "@/lib/cn";
import { PROBABILITY_LABELS, probabilityClass } from "@/lib/forecast";
import { formatPercent } from "@/lib/format";
import { PROBABILITY_COLORS, ROAD_STATUS, VILLAGE_STATUS, type RoadStatusCode } from "@/lib/status";
import type { VillageStatus } from "@/types/data";

const VILLAGE_ICONS = {
  reachable: CircleCheck,
  partially_isolated: CircleAlert,
  fully_isolated: Ban,
} as const;

export function VillageStatusBadge({ status, className }: { status: VillageStatus; className?: string }) {
  const meta = VILLAGE_STATUS[status];
  const Icon = VILLAGE_ICONS[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-xs font-semibold", className)}
      style={{ color: status === "reachable" ? "var(--ink-2)" : meta.color, backgroundColor: `${meta.color}1f` }}
    >
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </span>
  );
}

export function ProbabilityBadge({ probability, className }: { probability: number; className?: string }) {
  const cls = probabilityClass(probability);
  const color = PROBABILITY_COLORS[cls];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-[6px] border px-1.5 py-0.5 text-xs font-semibold text-ink", className)}
      style={{ borderColor: `${color}99`, backgroundColor: `${color}26` }}
    >
      <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {PROBABILITY_LABELS[cls]} · <span className="font-data">{formatPercent(probability)}</span>
    </span>
  );
}

export function RoadStatusSwatch({ status, className }: { status: RoadStatusCode; className?: string }) {
  const meta = ROAD_STATUS[status];
  return (
    <svg aria-hidden viewBox="0 0 28 8" className={cn("h-2 w-7 shrink-0", className)}>
      <line x1="2" y1="4" x2="26" y2="4" stroke={meta.color} strokeWidth="4" strokeLinecap="round" />
      {meta.dashed ? (
        <line x1="2" y1="4" x2="26" y2="4" stroke="var(--surface)" strokeWidth="1.6" strokeDasharray="3 3" />
      ) : null}
    </svg>
  );
}

export function RoadStatusLabel({ status }: { status: RoadStatusCode }) {
  const meta = ROAD_STATUS[status];
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <RoadStatusSwatch status={status} />
      <span className="font-semibold text-ink">{meta.label}</span>
      <span className="text-muted">{meta.description}</span>
    </span>
  );
}

export function UnknownIcon() {
  return <CircleSlash className="size-3.5" aria-hidden />;
}
