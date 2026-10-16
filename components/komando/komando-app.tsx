"use client";

import Link from "next/link";
import { Download, FileText, X } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Dialog } from "radix-ui";
import { useMemo, useState } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { MODE_OPTIONS, ModeControls } from "@/components/map/map-controls";
import { ModeBadge } from "@/components/map/mode-badge";
import { RankingTable } from "@/components/komando/ranking-table";
import { SettingsDialog } from "@/components/komando/settings-dialog";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { MapFrame } from "@/components/ui/map-frame";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/stat";
import { VillageDetailPanel } from "@/components/village/village-detail";
import { useMapParams } from "@/hooks/use-map-params";
import { useMapScene } from "@/hooks/use-map-scene";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatDecimal } from "@/lib/format";
import { rankByPriority, rankingCsv } from "@/lib/ranking";
import { useSettings } from "@/lib/stores/settings";

export function KomandoApp() {
  const { params, setParams } = useMapParams();
  const { mode, horizon, date, level, vehicle, desa } = params;
  const [settingsOpen, setSettingsOpen] = useQueryState("pengaturan", parseAsBoolean.withDefault(false));
  const [district, setDistrict] = useState<string | null>(null);
  const weights = useSettings((state) => state.weights);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const scene = useMapScene({ mode, horizon, date, level, vehicle });

  const ranked = useMemo(() => rankByPriority(scene.villages, weights, district), [scene.villages, weights, district]);
  const selected = scene.villages.find((v) => v.village_id === desa) ?? null;
  const districts = scene.manifest?.region.districts ?? [];
  const summary = scene.summary;

  function downloadCsv() {
    const blob = new Blob([rankingCsv(ranked)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `evaku-ranking-${scene.runId ?? `simulasi-${level}m`}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const reportHref = `/komando/laporan?mode=${mode}&h=${horizon}${date ? `&date=${date}` : ""}&level=${level}&vehicle=${vehicle}`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10">
      <div className="-mt-12 flex flex-wrap justify-end gap-4 max-lg:mt-4 max-lg:justify-start">
        <div className="flex flex-wrap gap-2">
          <SettingsDialog open={settingsOpen} onOpenChange={(open) => void setSettingsOpen(open || null)} />
          <Button variant="secondary" size="sm" onClick={downloadCsv} disabled={ranked.length === 0}>
            <Download /> Unduh CSV
          </Button>
          <Button asChild size="sm">
            <Link href={reportHref}>
              <FileText /> Laporan situasi
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 [&>*]:min-w-0 gap-4 rounded-[14px] border border-rule bg-surface p-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="space-y-3">
          <Segmented label="Sumber data" value={mode} options={MODE_OPTIONS} onChange={(value) => void setParams({ mode: value, desa: null })} />
          {scene.manifest ? (
            <ModeBadge
              mode={mode}
              eventName={scene.manifest.event.name}
              eventDate={scene.manifest.event.peak_date}
              dataTime={scene.runTime}
              detail={mode === "simulasi" ? `Tinggi air ${formatDecimal(level)} m` : undefined}
            />
          ) : null}
        </div>
        <div className="lg:max-w-xl lg:justify-self-end">
          <ModeControls
            mode={mode}
            manifest={scene.manifest}
            horizon={horizon}
            date={date}
            level={level}
            vehicle={vehicle}
            computing={scene.isFetching}
            layout="horizontal"
            onHorizon={(h) => void setParams({ h })}
            onDate={(value) => void setParams({ date: value })}
            onLevel={(value) => void setParams({ level: value })}
            onVehicle={(value) => void setParams({ vehicle: value })}
          />
        </div>
      </div>

      <section aria-label="Ringkasan" className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-[14px] border border-rule bg-surface p-5 sm:grid-cols-3 lg:grid-cols-6">
        {summary ? (
          <>
            <Stat value={summary.isolatedVillages} label="Desa terisolasi total" tone="cut" />
            <Stat value={summary.partialVillages} label="Terisolasi sebagian" tone="limited" />
            <Stat value={summary.isolatedPopulation} label="Warga terisolasi" />
            <Stat value={summary.children} label="Balita di desa terdampak" />
            <Stat value={summary.elderly} label="Lansia di desa terdampak" />
            <Stat value={summary.cutRoadKm} decimals={1} unit="km" label="Jalan putus" />
          </>
        ) : (
          Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14" />)
        )}
      </section>

      <div className="mt-6 grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[1fr_380px]">
        <section aria-label="Ranking desa" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Ranking prioritas</h2>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              Kecamatan
              <select
                value={district ?? ""}
                onChange={(event) => setDistrict(event.target.value || null)}
                className="h-9 rounded-[8px] border border-rule bg-surface px-2 text-sm text-ink"
              >
                <option value="">Semua kecamatan</option>
                {districts.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {scene.error ? (
            <ErrorState message={scene.error.message} onRetry={scene.retry} />
          ) : scene.villages.length === 0 ? (
            <Skeleton className="h-96" />
          ) : (
            <RankingTable rows={ranked} weights={weights} selectedId={desa} onSelect={(id) => void setParams({ desa: id })} maxHeight />
          )}
        </section>
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <MapFrame title="Peta desa prioritas" bodyClassName="h-80 lg:h-[420px]">
            <LazyMapCanvas
              initialBounds={scene.manifest?.region.bbox}
              camera={
                selected
                  ? { kind: "point", center: selected.center, zoom: 12, key: selected.village_id }
                  : scene.manifest
                    ? { kind: "bounds", bbox: scene.manifest.region.bbox, key: "region" }
                    : null
              }
              roads={scene.roads}
              villages={scene.fills}
              selectedVillageId={desa}
              flood={scene.flood}
              onSelectVillage={(id) => void setParams({ desa: id })}
              cooperativeGestures
              label="Peta ruang komando"
            />
          </MapFrame>
        </aside>
      </div>

      <Dialog.Root open={desa !== null} onOpenChange={(open) => !open && void setParams({ desa: null })}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/20" />
          <Dialog.Content
            aria-describedby={undefined}
            className={
              desktop
                ? "fixed inset-y-0 right-0 z-50 w-[440px] overflow-y-auto border-l border-rule bg-surface p-6 shadow-float"
                : "fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[18px] border-t border-rule bg-surface p-5 shadow-float"
            }
            data-lenis-prevent
          >
            <div className="mb-2 flex justify-between">
              <Dialog.Title className="label-data">Detail desa</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Tutup">
                  <X />
                </Button>
              </Dialog.Close>
            </div>
            {desa ? (
              <VillageDetailPanel
                villageId={desa}
                runId={scene.runId ?? scene.manifest?.radar_runs[0]?.run_id ?? ""}
                runTime={scene.runTime ?? ""}
                horizon={mode === "prakiraan" ? horizon : undefined}
                override={
                  mode === "simulasi" && selected
                    ? { status: selected.status, isolated_population: selected.isolated_population, priority_score: selected.priority_score, route: null }
                    : null
                }
                compact
              />
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
