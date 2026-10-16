"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs } from "radix-ui";
import { useMemo, useState } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { WaterGauge } from "@/components/map/water-gauge";
import { Button } from "@/components/ui/button";
import { MapFrame } from "@/components/ui/map-frame";
import { Ornament } from "@/components/ui/ornament";
import { SourceNote } from "@/components/ui/source-note";
import { Stat } from "@/components/ui/stat";
import { useActiveRegions, useManifest, useNationalFloods, useProvinces, useSimulation } from "@/hooks/use-data";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDecimal } from "@/lib/format";
import { INDONESIA_BOUNDS } from "@/lib/map-config";
import type { VillageFill } from "@/types/map";

type HeroTab = "region" | "national";

export function HomeHero() {
  const [tab, setTab] = useState<HeroTab>("region");
  const [level, setLevel] = useState(1);
  const debounced = useDebouncedValue(level, 200);
  const manifest = useManifest();
  const simulation = useSimulation(debounced, "car");
  const provinces = useProvinces(tab === "national");
  const floods = useNationalFloods();
  const regions = useActiveRegions();
  const summary = simulation.data?.summary;
  const region = manifest.data?.region;

  const fills = useMemo<VillageFill[]>(
    () => (simulation.data?.villages ?? []).map((v) => ({ village_id: v.village_id, status: v.status })),
    [simulation.data],
  );

  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="mx-auto grid grid-cols-1 [&>*]:min-w-0 w-full max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:pb-20">
        <div className="relative">
          <Ornament name="contours" className="absolute -left-40 -top-24 h-[520px] w-[680px] text-brand/[0.08]" />
          <div className="relative">
            <p className="label-data">Peringatan akses banjir · Indonesia</p>
            <h1 className="mt-4 text-display text-ink">
              Tahu desa mana yang akan terputus, <span className="text-brand">sebelum air datang.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
              EvaKu memperkirakan peluang banjir 1–3 hari ke depan, jalan yang akan putus, desa yang terisolasi, dan
              titik evakuasi terdekat untuk warga.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/map">
                  Buka peta <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/about#cara-kerja">Cara kerja</Link>
              </Button>
            </div>
            <div className="mt-10 border-t border-rule pt-6">
              <p className="label-data">
                Jika {region?.river.name ?? "sungai"} naik <span className="text-brand">{formatDecimal(level)} m</span>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-4" aria-live="polite">
                <Stat value={summary?.isolated_villages ?? 0} label="desa terisolasi" tone="cut" />
                <Stat value={summary?.isolated_population ?? 0} label="warga terputus" />
                <Stat value={summary?.cut_road_km ?? 0} decimals={0} unit="km" label="jalan putus" />
              </div>
              <SourceNote className="mt-3">Simulasi mesin akses EvaKu · {region?.name ?? "wilayah aktif"} · kendaraan mobil</SourceNote>
            </div>
          </div>
        </div>

        <Tabs.Root value={tab} onValueChange={(value) => setTab(value === "national" ? "national" : "region")}>
          <MapFrame
            title={tab === "national" ? "Indonesia · kejadian banjir 2024" : `Wilayah aktif · ${region?.name ?? ""}`}
            toolbar={
              <Tabs.List aria-label="Cakupan peta" className="flex rounded-[8px] border border-rule bg-surface-2 p-0.5">
                {(["region", "national"] as const).map((value) => (
                  <Tabs.Trigger
                    key={value}
                    value={value}
                    className="rounded-[6px] px-2.5 py-1 text-xs font-semibold text-ink-2 data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-[0_1px_2px_rgb(11_27_46/0.12)]"
                  >
                    {value === "region" ? "Wilayah aktif" : "Indonesia"}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            }
            bodyClassName="h-[360px] sm:h-[460px]"
            footer={
              tab === "region" ? (
                <div className="flex items-center gap-4">
                  <span className="label-data shrink-0">Tinggi air</span>
                  <WaterGauge value={level} onChange={setLevel} max={3} orientation="horizontal" className="flex-1" valueText={`${formatDecimal(level)} meter, ${summary?.isolated_villages ?? 0} desa terisolasi`} />
                  <span className="w-14 shrink-0 text-right font-data text-lg font-semibold text-brand">{formatDecimal(level)} m</span>
                </div>
              ) : (
                <p className="text-xs text-ink-2">
                  {floods.data ? `${floods.data.total_floods.toLocaleString("id-ID")} kejadian banjir · sumber ${floods.data.source}` : "Memuat…"}
                </p>
              )
            }
          >
            <LazyMapCanvas
              initialBounds={region?.bbox ?? INDONESIA_BOUNDS}
              camera={
                tab === "national"
                  ? { kind: "bounds", bbox: INDONESIA_BOUNDS, padding: 16, key: "national" }
                  : region
                    ? { kind: "bounds", bbox: region.bbox, padding: 16, key: "region" }
                    : null
              }
              roads={tab === "region" ? (simulation.data?.roads ?? []) : []}
              villages={tab === "region" ? fills : []}
              layers={{ places: false, route: false, flood: false, roads: tab === "region", villages: tab === "region" }}
              national={{
                provinces: provinces.data,
                floods: floods.data,
                activeRegions: regions.data,
                visible: tab === "national",
                onSelectRegion: () => setTab("region"),
              }}
              cooperativeGestures
              navigation={false}
              label="Peta pratinjau EvaKu"
            />
          </MapFrame>
        </Tabs.Root>
      </div>
    </section>
  );
}
