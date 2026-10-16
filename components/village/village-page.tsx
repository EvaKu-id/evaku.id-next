"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Map } from "lucide-react";
import { useMemo } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { Button } from "@/components/ui/button";
import { MapFrame } from "@/components/ui/map-frame";
import { Segmented } from "@/components/ui/segmented";
import { ShareButton } from "@/components/village/share-button";
import { VillageDetailPanel } from "@/components/village/village-detail";
import { useManifest, useRunRoads, useVillage } from "@/hooks/use-data";
import { bboxOfPoints } from "@/lib/geo";
import { formatDateShort, formatWib } from "@/lib/format";
import { isHorizon } from "@/lib/forecast";
import type { LngLat } from "@/types/map";

export function VillagePage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const manifest = useManifest();
  const runs = useMemo(
    () => [
      ...(manifest.data?.forecast_runs ?? []).map((run) => ({
        id: run.run_id,
        label: `Prakiraan ${run.horizon_hours} jam`,
        time: run.data_time,
        horizon: run.horizon_hours,
      })),
      ...(manifest.data?.radar_runs ?? []).map((run) => ({
        id: run.run_id,
        label: `Radar ${formatDateShort(run.date)}`,
        time: run.data_time,
        horizon: undefined,
      })),
    ],
    [manifest.data],
  );
  const requested = search.get("run");
  const run = runs.find((item) => item.id === requested) ?? runs.find((item) => item.horizon === 72) ?? runs[0];
  const h = Number(search.get("h"));
  const village = useVillage(id, run?.id ?? null);
  const roads = useRunRoads(run?.id ?? null);

  const points = useMemo<LngLat[]>(() => {
    const data = village.data;
    if (!data) return [];
    return [
      data.center,
      ...(data.run.route?.coordinates ?? []),
      ...(data.run.evacuations ?? []).map((site): LngLat => [site.lon, site.lat]),
    ];
  }, [village.data]);
  const bbox = bboxOfPoints(points);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/map?desa=${id}`}>
            <ArrowLeft /> Kembali ke peta
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {runs.length > 0 && run ? (
            <Segmented
              label="Waktu data"
              size="sm"
              value={run.id}
              options={runs.map((item) => ({ value: item.id, label: item.label }))}
              onChange={(value) => {
                const url = new URL(window.location.href);
                url.searchParams.set("run", value);
                window.history.replaceState(null, "", url);
              }}
            />
          ) : null}
        </div>
      </div>
      <h1 className="sr-only">{village.data?.name ?? "Detail desa"}</h1>
      {run ? <p className="mt-4 text-xs text-muted">Data per {formatWib(run.time)}</p> : null}

      <div className="mt-4 grid grid-cols-1 [&>*]:min-w-0 gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          {run ? (
            <VillageDetailPanel
              villageId={id}
              runId={run.id}
              runTime={run.time}
              horizon={isHorizon(h) ? h : run.horizon}
            />
          ) : null}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <MapFrame
            title={village.data ? `Lembar · ${village.data.name}` : "Lembar desa"}
            corner={village.data ? `${village.data.center[1].toFixed(3)}°, ${village.data.center[0].toFixed(3)}°` : undefined}
            bodyClassName="h-[420px] lg:h-[560px]"
            footer={
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted">Rute bantuan biru · rute evakuasi hijau · lintasan perahu putus-putus</p>
                <div className="flex gap-2">
                  {village.data ? <ShareButton title={`EvaKu · ${village.data.name}`} path={`/desa/${id}?run=${run?.id ?? ""}`} /> : null}
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/map?desa=${id}`}>
                      <Map /> Peta penuh
                    </Link>
                  </Button>
                </div>
              </div>
            }
          >
            {village.data ? (
              <LazyMapCanvas
                initialBounds={bbox ?? undefined}
                camera={bbox ? { kind: "bounds", bbox, padding: 60, key: `${id}:${run?.id}` } : null}
                roads={roads.data ?? []}
                villages={[{ village_id: id, status: village.data.run.status }]}
                selectedVillageId={id}
                route={{
                  route: village.data.run.route,
                  villageCenter: village.data.center,
                  evacuations: village.data.run.evacuations,
                }}
                cooperativeGestures
                label={`Peta desa ${village.data.name}`}
              />
            ) : null}
          </MapFrame>
        </div>
      </div>
    </div>
  );
}
