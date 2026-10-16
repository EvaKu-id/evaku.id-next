import { cn } from "@/lib/cn";
import { formatDateShort, formatWib } from "@/lib/format";
import type { MapMode } from "@/types/data";

interface ModeBadgeProps {
  mode: MapMode;
  eventName: string;
  eventDate: string;
  dataTime?: string | null;
  detail?: string;
  className?: string;
}

export function ModeBadge({ mode, eventName, eventDate, dataTime, detail, className }: ModeBadgeProps) {
  const simulation = mode === "simulasi";
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "shrink-0 rounded-[6px] px-2 py-1 font-data text-xs font-bold tracking-[0.12em]",
          simulation ? "bg-brand text-white" : "bg-ink text-white",
        )}
      >
        {simulation ? "SIMULASI" : "REPLAY"}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-sm font-semibold leading-snug text-ink">
          {simulation ? "Skenario tinggi air" : `${eventName} · puncak ${formatDateShort(eventDate)}`}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {detail ?? (dataTime ? `Data per ${formatWib(dataTime)}` : "")}
        </p>
      </div>
    </div>
  );
}
