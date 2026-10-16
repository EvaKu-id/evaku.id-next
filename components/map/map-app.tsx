"use client";

import { ChevronLeft, Globe2, Info, List } from "lucide-react";
import { Popover } from "radix-ui";
import { useCallback, useMemo, useState } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { LayerToggles } from "@/components/map/layer-toggles";
import { MapLegend } from "@/components/map/map-legend";
import { ModeBadge } from "@/components/map/mode-badge";
import { MODE_OPTIONS, ModeControls } from "@/components/map/map-controls";
import { NationalPanel } from "@/components/map/national-panel";
import { RoadPopup } from "@/components/map/road-popup";
import { RunSummaryStrip } from "@/components/map/run-summary-strip";
import { VillageList } from "@/components/map/village-list";
import { VillageSearch } from "@/components/map/village-search";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet } from "@/components/ui/sheet";
import { VillageDetailPanel, type VillageOverride } from "@/components/village/village-detail";
import type { CameraTarget } from "@/hooks/use-map-camera";
import { useMapParams } from "@/hooks/use-map-params";
import { useMapScene } from "@/hooks/use-map-scene";
import type { ProvinceHover } from "@/hooks/use-province-layers";
import type { SelectedRoadInfo } from "@/hooks/use-road-layers";
import {
  useActiveRegions,
  useEvacuationSites,
  useHubs,
  useLowConfidence,
  useNationalFloods,
  useProvinces,
  useRoute,
  useVillage,
} from "@/hooks/use-data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { INDONESIA_BOUNDS } from "@/lib/map-config";
import { formatDecimal, formatNumber } from "@/lib/format";
import type { MapMode } from "@/types/data";

const SNAPS = [0.2, 0.55, 0.92];

export function MapApp() {
  const { params, setParams, setLayers } = useMapParams();
  const { mode, scope, horizon, date, level, vehicle, desa, layers } = params;
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [road, setRoad] = useState<SelectedRoadInfo | null>(null);
  const [hover, setHover] = useState<ProvinceHover | null>(null);
  const [snap, setSnap] = useState<number | string | null>(params.panel || desa ? SNAPS[1] : SNAPS[0]);

  const scene = useMapScene({ mode, horizon, date, level, vehicle });
  const national = scope === "national";
  const provinces = useProvinces(national);
  const floods = useNationalFloods();
  const activeRegions = useActiveRegions();
  const sites = useEvacuationSites(!national);
  const hubs = useHubs(!national);
  const lowConfidence = useLowConfidence(mode === "radar");

  const villageMeta = scene.villages.find((v) => v.village_id === desa) ?? null;
  const village = useVillage(mode === "simulasi" ? null : desa, scene.runId);
  const simRoute = useRoute(mode === "simulasi" ? desa : null, vehicle, level);

  const region = scene.manifest?.region;
  const camera = useMemo<CameraTarget | null>(() => {
    if (national) return { kind: "bounds", bbox: INDONESIA_BOUNDS, key: "national" };
    if (villageMeta) return { kind: "point", center: villageMeta.center, zoom: 12, key: `v:${villageMeta.village_id}` };
    if (region) return { kind: "bounds", bbox: region.bbox, key: `r:${region.region_id}` };
    return null;
  }, [national, villageMeta, region]);

  const override = useMemo<VillageOverride | null>(() => {
    if (mode !== "simulasi" || !villageMeta) return null;
    return {
      status: villageMeta.status,
      isolated_population: villageMeta.isolated_population,
      priority_score: villageMeta.priority_score,
      route: simRoute.data ?? null,
    };
  }, [mode, villageMeta, simRoute.data]);

  const routeOverlay = useMemo(
    () => ({
      route: mode === "simulasi" ? (simRoute.data ?? null) : (village.data?.run.route ?? null),
      villageCenter: villageMeta?.center ?? null,
      evacuations: mode === "simulasi" ? null : (village.data?.run.evacuations ?? null),
    }),
    [mode, simRoute.data, village.data, villageMeta],
  );

  const selectVillage = useCallback(
    (villageId: string) => {
      setRoad(null);
      void setParams({ desa: villageId, scope: "region" });
      setSnap(SNAPS[1]);
    },
    [setParams],
  );

  const openRegion = useCallback(() => {
    void setParams({ scope: "region", desa: null });
    setRoad(null);
  }, [setParams]);

  const modeLabel: MapMode = mode;
  const dataTime = scene.runTime;
  const detail =
    mode === "simulasi"
      ? `Tinggi air ${formatDecimal(level)} m · ${vehicle === "car" ? "mobil" : "truk/4x4"}`
      : undefined;

  const panel = national ? (
    <NationalPanel onOpenRegion={openRegion} />
  ) : desa && scene.runId !== undefined ? (
    <div className="space-y-3">
      <Button variant="ghost" size="sm" onClick={() => void setParams({ desa: null })} className="-ml-2">
        <ChevronLeft /> Semua desa
      </Button>
      <VillageDetailPanel
        villageId={desa}
        runId={scene.runId ?? scene.manifest?.radar_runs[0]?.run_id ?? ""}
        runTime={scene.runTime ?? ""}
        horizon={mode === "prakiraan" ? horizon : undefined}
        override={override}
        compact
      />
    </div>
  ) : (
    <div className="space-y-5">
      <div>
        <p className="label-data">{region ? `${region.name} · ${region.province}` : "Wilayah aktif"}</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
          {mode === "prakiraan" ? `Desa berpeluang banjir · ${horizon} jam` : mode === "radar" ? "Desa terdampak hari ini" : "Dampak skenario"}
        </h2>
      </div>
      {scene.error ? <ErrorState message={scene.error.message} onRetry={scene.retry} /> : <RunSummaryStrip summary={scene.summary} />}
      {scene.source === "fallback" ? (
        <p className="rounded-[8px] bg-status-limited/10 px-3 py-2 text-xs font-semibold text-ink">Hasil cadangan per 10 cm</p>
      ) : null}
      {scene.error ? null : (
        <section>
          <h3 className="label-data mb-1">{mode === "prakiraan" ? "Diurutkan menurut peluang dan jam putus" : "Diurutkan menurut skor prioritas"}</h3>
          {scene.villages.length === 0 && scene.isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <VillageList villages={scene.villages} mode={mode} selectedId={desa} onSelect={selectVillage} />
          )}
        </section>
      )}
    </div>
  );

  const controls = (
    <ModeControls
      mode={mode}
      manifest={scene.manifest}
      horizon={horizon}
      date={date}
      level={level}
      vehicle={vehicle}
      computing={scene.isFetching}
      layout={desktop ? "vertical" : "horizontal"}
      onHorizon={(h) => void setParams({ h })}
      onDate={(value) => void setParams({ date: value })}
      onLevel={(value) => void setParams({ level: value })}
      onVehicle={(value) => void setParams({ vehicle: value })}
    />
  );

  return (
    <div className="relative flex h-[calc(100dvh-4rem)] w-full overflow-hidden bg-surface-2">
      <div className="relative min-w-0 flex-1">
        <LazyMapCanvas
          initialBounds={region?.bbox ?? INDONESIA_BOUNDS}
          camera={camera}
          roads={national ? [] : scene.roads}
          villages={national ? [] : scene.fills}
          villageMode={mode === "prakiraan" ? "probability" : "status"}
          selectedVillageId={desa}
          flood={national ? null : scene.flood}
          lowConfidence={mode === "radar" && !national ? (lowConfidence.data ?? null) : null}
          sites={sites.data ?? null}
          hubs={hubs.data ?? null}
          route={routeOverlay}
          layers={national ? { roads: false, villages: false, flood: false, places: false, route: false } : layers}
          national={{
            provinces: provinces.data,
            floods: floods.data,
            activeRegions: activeRegions.data,
            visible: national,
            onHover: setHover,
            onSelectRegion: openRegion,
          }}
          onSelectRoad={setRoad}
          onSelectVillage={selectVillage}
          label="Peta EvaKu"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start gap-2 p-3">
          <div className="pointer-events-auto flex items-center gap-1 rounded-[10px] border border-rule bg-surface p-1 shadow-float">
            <button
              type="button"
              onClick={() => void setParams({ scope: national ? "region" : "national", desa: null })}
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-2"
              aria-pressed={national}
            >
              <Globe2 className="size-4" aria-hidden /> {national ? "Kembali ke wilayah" : "Indonesia"}
            </button>
            {!national ? (
              <Segmented
                label="Mode peta"
                value={mode}
                options={MODE_OPTIONS}
                onChange={(value) => void setParams({ mode: value })}
                className="border-0 bg-transparent"
              />
            ) : null}
          </div>
          {!national ? (
            <div className="pointer-events-auto ml-auto flex w-full items-center gap-2 sm:w-auto sm:pr-12">
              <VillageSearch villages={scene.villages} onSelect={selectVillage} />
              <LayerToggles value={layers} onChange={setLayers} />
            </div>
          ) : null}
        </div>

        {!national && desktop ? (
          <div className="pointer-events-auto absolute left-3 top-16 w-72 rounded-[14px] border border-rule bg-surface p-3 shadow-float">
            {scene.manifest ? (
              <ModeBadge
                mode={modeLabel}
                eventName={scene.manifest.event.name}
                eventDate={scene.manifest.event.peak_date}
                dataTime={dataTime}
                detail={detail}
                className="mb-3 border-b border-rule pb-3"
              />
            ) : null}
            {controls}
          </div>
        ) : null}

        {!national ? (
          <div className="pointer-events-auto absolute bottom-12 right-3 hidden lg:block">
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button variant="secondary" size="sm" className="shadow-float">
                  <Info /> Legenda
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content side="top" align="end" sideOffset={8} className="z-50 w-64 rounded-[12px] border border-rule bg-surface p-3 shadow-float">
                  <MapLegend mode={mode} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ) : null}

        {national && hover ? (
          <div
            className="pointer-events-none absolute z-10 rounded-[10px] border border-rule bg-surface px-3 py-2 text-xs shadow-float"
            style={{ left: hover.point[0] + 12, top: hover.point[1] + 12 }}
          >
            <p className="font-semibold text-ink">{hover.name}</p>
            <p className="text-muted">
              {hover.floods === null ? "Tidak ada catatan" : `${formatNumber(hover.floods)} kejadian banjir (2024)`}
            </p>
          </div>
        ) : null}

        {road ? (
          <div className="absolute bottom-24 left-3 z-10 lg:bottom-8">
            <RoadPopup
              road={road}
              sourceLabel={mode === "radar" ? "Radar Sentinel-1" : mode === "prakiraan" ? "Prakiraan" : "Simulasi"}
              onClose={() => setRoad(null)}
            />
          </div>
        ) : null}

        {!desktop && !national && scene.manifest ? (
          <div className="pointer-events-auto absolute inset-x-3 top-[6.5rem] rounded-[12px] border border-rule bg-surface px-3 py-2 shadow-float">
            <ModeBadge
              mode={modeLabel}
              eventName={scene.manifest.event.name}
              eventDate={scene.manifest.event.peak_date}
              dataTime={dataTime}
              detail={detail}
            />
          </div>
        ) : null}
      </div>

      {desktop ? (
        <aside
          aria-label="Panel informasi"
          className="w-[400px] shrink-0 overflow-y-auto border-l border-rule bg-surface p-5"
          data-lenis-prevent
        >
          {panel}
        </aside>
      ) : (
        <Sheet title="Panel informasi" snapPoints={SNAPS} activeSnap={snap} onSnapChange={setSnap}>
          <div className="space-y-5 px-4 pb-10 pt-2">
            {!national ? (
              <div className="rounded-[12px] border border-rule bg-surface-2 p-3">{controls}</div>
            ) : null}
            {!national && !desa ? (
              <button
                type="button"
                onClick={() => setSnap(SNAPS[2])}
                className="flex w-full items-center gap-2 text-sm font-semibold text-brand"
              >
                <List className="size-4" aria-hidden /> Lihat daftar desa
              </button>
            ) : null}
            {panel}
          </div>
        </Sheet>
      )}
    </div>
  );
}
