"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { FeatureTile } from "@/components/home/feature-tile";
import { VillageDotMap } from "@/components/home/village-dot-map";
import { RankingTable } from "@/components/komando/ranking-table";
import { Ornament } from "@/components/ui/ornament";
import { RoadStatusSwatch, VillageStatusBadge } from "@/components/ui/status";
import { Skeleton } from "@/components/ui/skeleton";
import { EvacuationCard } from "@/components/village/evacuation-list";
import { useFloodIndex, useManifest, useMetrics, useRunVillages } from "@/hooks/use-data";
import { useFeaturedEvacuation } from "@/hooks/use-featured-evacuation";
import { dataSource } from "@/lib/data";
import { feature } from "@/lib/features";
import { cutoffLabel, probabilityClass } from "@/lib/forecast";
import { formatNumber, formatRatio } from "@/lib/format";
import { metricValue } from "@/lib/metrics";
import { rankByPriority } from "@/lib/ranking";
import { DEFAULT_WEIGHTS } from "@/lib/scoring";
import { PROBABILITY_COLORS, ROAD_STATUS, type RoadStatusCode } from "@/lib/status";

const ROAD_DEMO: { status: RoadStatusCode; d: string }[] = [
  { status: 0, d: "M10 80 C60 70 90 40 150 44" },
  { status: 1, d: "M150 44 C200 48 230 70 280 66" },
  { status: 2, d: "M150 44 C160 90 190 110 240 120" },
  { status: 3, d: "M10 120 C60 116 100 130 150 128" },
];

export function FeatureBento() {
  const reduced = useReducedMotion();
  const manifest = useManifest();
  const forecastRun = manifest.data?.forecast_runs.find((r) => r.horizon_hours === 72);
  const radarRun = manifest.data?.radar_runs[0];
  const forecastVillages = useRunVillages(forecastRun?.run_id ?? null);
  const radarVillages = useRunVillages(radarRun?.run_id ?? null);
  const floodIndex = useFloodIndex();
  const metrics = useMetrics();
  const bbox = manifest.data?.region.bbox;

  const ranked = [...(forecastVillages.data ?? [])]
    .filter((v) => v.cutoff_hour !== null)
    .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0));
  const featured = useFeaturedEvacuation();
  const priority = rankByPriority(radarVillages.data ?? [], DEFAULT_WEIGHTS, null);
  const floodDate = floodIndex.data?.dates[0];

  return (
    <div className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
      <FeatureTile feature={feature("P1")} size="lg" className="md:col-span-3 md:row-span-2">
        <div className="flex h-full min-h-64 items-center justify-center p-4">
          {forecastVillages.data && bbox ? (
            <VillageDotMap
              villages={forecastVillages.data}
              bbox={bbox}
              colorOf={(v) => PROBABILITY_COLORS[probabilityClass(v.probability ?? 0)]}
              className="max-h-80 w-full"
              label="Sebaran peluang banjir 72 jam per desa"
            />
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("P2")} className="md:col-span-3">
        <ol className="divide-y divide-rule px-4 py-2">
          {ranked.slice(0, 3).map((village) => (
            <li key={village.village_id} className="flex items-center gap-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate font-semibold text-ink">{village.name}</span>
              <span className="text-xs text-muted">{cutoffLabel(village.cutoff_hour)}</span>
              <span className="font-data text-xs text-ink">{formatNumber(village.population)} jiwa</span>
            </li>
          ))}
          {ranked.length === 0 ? <Skeleton className="my-2 h-24" /> : null}
        </ol>
      </FeatureTile>

      <FeatureTile feature={feature("P3")} className="md:col-span-3">
        <div className="p-4">
          {featured ? (
            <ul>
              <EvacuationCard site={featured.site} runTime={featured.runTime} />
            </ul>
          ) : (
            <Skeleton className="h-28" />
          )}
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F1")} className="md:col-span-2">
        <div className="relative h-44 overflow-hidden">
          <Ornament name="contours" className="absolute inset-0 text-brand/10" />
          {floodDate ? (
            <Image src={dataSource.floodImageUrl(floodDate.date)} alt="Genangan radar" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-3" unoptimized />
          ) : null}
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F2")} className="md:col-span-2">
        <div className="p-4">
          <svg viewBox="0 0 290 140" className="h-28 w-full" aria-hidden>
            {ROAD_DEMO.map((road) => (
              <g key={road.status}>
                <path d={road.d} stroke={ROAD_STATUS[road.status].color} strokeWidth="6" fill="none" strokeLinecap="round" />
                {ROAD_STATUS[road.status].dashed ? <path d={road.d} stroke="var(--surface)" strokeWidth="2" strokeDasharray="5 5" fill="none" /> : null}
              </g>
            ))}
          </svg>
          <ul className="mt-1 grid grid-cols-2 gap-1 text-xs text-ink-2">
            {ROAD_DEMO.map((road) => (
              <li key={road.status} className="flex items-center gap-1.5">
                <RoadStatusSwatch status={road.status} /> {ROAD_STATUS[road.status].label}
              </li>
            ))}
          </ul>
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F3")} className="md:col-span-2">
        <ul className="space-y-2 p-4">
          {priority.slice(0, 3).map((village) => (
            <li key={village.village_id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate font-semibold text-ink">{village.name}</span>
              <VillageStatusBadge status={village.status} />
            </li>
          ))}
          {priority.length === 0 ? <Skeleton className="h-24" /> : null}
        </ul>
      </FeatureTile>

      <FeatureTile feature={feature("F6")} size="lg" className="md:col-span-4">
        <div className="relative aspect-video overflow-hidden bg-bg">
          <video
            className="size-full object-cover"
            poster="/media/air-naik-poster.webp"
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Animasi tinggi air naik dari 0 sampai 3 meter dan jalan yang putus"
          >
            <source src="/media/air-naik.webm" type="video/webm" />
            <source src="/media/air-naik.mp4" type="video/mp4" />
          </video>
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F4")} className="md:col-span-2">
        <div className="relative h-full min-h-44">
          <Ornament name="contours" className="absolute inset-0 text-brand/10" />
          <Ornament name="route-sample" className="absolute inset-5 text-brand" />
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F5")} className="md:col-span-4">
        <div className="pointer-events-none p-3">
          <RankingTable rows={priority} weights={DEFAULT_WEIGHTS} selectedId={null} onSelect={() => undefined} limit={4} compact />
        </div>
      </FeatureTile>

      <FeatureTile feature={feature("F8")} className="md:col-span-2">
        <dl className="grid h-full grid-cols-2 content-center gap-3 p-5">
          <div>
            <dt className="text-xs text-muted">IoU genangan</dt>
            <dd className="font-data text-2xl font-semibold text-ink">{formatRatio(metricValue(metrics.data, "unet", "iou_water") ?? 0)}</dd>
            <dd className="text-xs text-muted">Otsu {formatRatio(metricValue(metrics.data, "unet", "iou_otsu_baseline") ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">PR-AUC peluang</dt>
            <dd className="font-data text-2xl font-semibold text-ink">{formatRatio(metricValue(metrics.data, "lgbm", "pr_auc") ?? 0)}</dd>
            <dd className="text-xs text-muted">hujan 3 hari {formatRatio(metricValue(metrics.data, "lgbm", "pr_auc_baseline_rain3d") ?? 0)}</dd>
          </div>
        </dl>
      </FeatureTile>

      <div className="grid gap-4 md:col-span-6 md:grid-cols-3">
        <FeatureTile feature={feature("F7")} size="sm" />
        <FeatureTile feature={feature("F9")} size="sm" />
        <FeatureTile feature={feature("F10")} size="sm" />
      </div>
    </div>
  );
}
