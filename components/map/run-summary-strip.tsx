import { Stat } from "@/components/ui/stat";
import { Skeleton } from "@/components/ui/skeleton";
import type { RunSummary } from "@/lib/run-summary";

export function RunSummaryStrip({ summary }: { summary: RunSummary | null }) {
  if (!summary) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      <Stat value={summary.isolatedVillages} label="Desa terisolasi total" tone="cut" />
      <Stat value={summary.partialVillages} label="Terisolasi sebagian" tone="limited" />
      <Stat value={summary.isolatedPopulation} label="Warga terisolasi" />
      <Stat value={summary.cutRoadKm} decimals={1} unit="km" label="Jalan putus" />
    </div>
  );
}
