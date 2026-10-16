import type { ReactNode } from "react";
import { SourceNote } from "@/components/ui/source-note";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent, formatRatio } from "@/lib/format";

interface MetricCardProps {
  label: string;
  value: number | null;
  format: "percent" | "ratio" | "ms";
  comparison?: ReactNode;
  note?: string | null;
}

function display(value: number, format: MetricCardProps["format"]): string {
  if (format === "percent") return formatPercent(value);
  if (format === "ms") return `${Math.round(value)} ms`;
  return formatRatio(value);
}

export function MetricCard({ label, value, format, comparison, note }: MetricCardProps) {
  return (
    <div className="rounded-[14px] border border-rule bg-surface p-5">
      <p className="text-sm text-ink-2">{label}</p>
      {value === null ? (
        <Skeleton className="mt-2 h-10 w-24" />
      ) : (
        <p className="mt-1 font-data text-4xl font-semibold tracking-tight text-ink">{display(value, format)}</p>
      )}
      {comparison ? <p className="mt-1 text-sm text-ink-2">{comparison}</p> : null}
      {note ? <SourceNote className="mt-2">{note}</SourceNote> : null}
    </div>
  );
}
