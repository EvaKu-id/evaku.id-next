"use client";

import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { VillageStatusBadge } from "@/components/ui/status";
import { EvacuationList } from "@/components/village/evacuation-list";
import { ImpactGrid } from "@/components/village/impact-grid";
import { ProbabilityChips } from "@/components/village/probability-chips";
import { RouteSummary } from "@/components/village/route-summary";
import { ScoreBreakdown } from "@/components/village/score-breakdown";
import { ShareButton } from "@/components/village/share-button";
import { TelegramSubscribe } from "@/components/village/telegram-subscribe";
import { useForecasts, useVillage } from "@/hooks/use-data";
import { PROBABILITY_THRESHOLDS, cutoffLabel } from "@/lib/forecast";
import type { Horizon, Route, VillageDetail, VillageStatus } from "@/types/data";

export interface VillageOverride {
  status: VillageStatus;
  isolated_population: number;
  priority_score: number | null;
  route: Route | null;
}

interface VillageDetailPanelProps {
  villageId: string;
  runId: string;
  runTime: string;
  horizon?: Horizon;
  override?: VillageOverride | null;
  onClose?: () => void;
  onData?: (village: VillageDetail) => void;
  compact?: boolean;
}

function Block({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="space-y-2">
      <h3 className="label-data">{title}</h3>
      {children}
    </section>
  );
}

export function applyOverride(village: VillageDetail, override: VillageOverride | null | undefined): VillageDetail {
  if (!override) return village;
  return {
    ...village,
    run: {
      ...village.run,
      status: override.status,
      isolated_population: override.isolated_population,
      priority_score: override.priority_score,
      route: override.route,
      travel_minutes_now: override.status === "fully_isolated" ? null : village.run.travel_minutes_now,
    },
  };
}

export function VillageDetailPanel({
  villageId,
  runId,
  runTime,
  horizon,
  override,
  onClose,
  compact = false,
}: VillageDetailPanelProps) {
  const villageQuery = useVillage(villageId, runId);
  const forecasts = useForecasts();

  if (villageQuery.isError) {
    return <ErrorState message={villageQuery.error.message} onRetry={() => villageQuery.refetch()} />;
  }
  if (!villageQuery.data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-20" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const village = applyOverride(villageQuery.data, override);
  const rows = (forecasts.data ?? []).filter((row) => row.village_id === villageId);
  const p72 = rows.find((row) => row.horizon_hours === 72)?.probability ?? 0;
  const cutoff = rows.find((row) => row.cutoff_hour !== null)?.cutoff_hour ?? null;
  const highProbability = p72 >= PROBABILITY_THRESHOLDS.high;

  return (
    <article className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-data">Kec. {village.district}</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">{village.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <VillageStatusBadge status={village.run.status} />
            <span className="text-xs text-muted">{cutoffLabel(cutoff)}</span>
          </div>
        </div>
        {onClose ? (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup detail desa">
            <X />
          </Button>
        ) : null}
      </header>

      {rows.length > 0 ? (
        <Block title="Peluang banjir">
          <ProbabilityChips rows={rows} active={horizon} />
        </Block>
      ) : null}

      <Block title="Dampak">
        <ImpactGrid village={village} />
      </Block>

      <Block title="Titik evakuasi" id="evakuasi">
        <EvacuationList sites={village.run.evacuations} runTime={runTime} highProbability={highProbability} />
      </Block>

      <Block title="Rute bantuan" id="rute">
        <RouteSummary route={village.run.route} />
      </Block>

      <Block title="Skor prioritas">
        <ScoreBreakdown items={village.run.score_breakdown} score={village.run.priority_score} />
      </Block>

      {compact ? (
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/desa/${villageId}?run=${runId}`}>
              Halaman desa <ArrowUpRight />
            </Link>
          </Button>
          <ShareButton title={`EvaKu · ${village.name}`} path={`/desa/${villageId}?run=${runId}`} />
        </div>
      ) : (
        <TelegramSubscribe villageId={villageId} villageName={village.name} />
      )}
    </article>
  );
}
