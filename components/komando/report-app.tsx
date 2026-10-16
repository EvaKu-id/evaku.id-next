"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { LazyMapCanvas } from "@/components/map/map-canvas-lazy";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VillageStatusBadge } from "@/components/ui/status";
import { useFloodIndex } from "@/hooks/use-data";
import { useMapParams } from "@/hooks/use-map-params";
import { useMapScene } from "@/hooks/use-map-scene";
import { dataSource } from "@/lib/data";
import { formatDecimal, formatNumber, formatWib } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { rankByPriority } from "@/lib/ranking";
import { useSettings } from "@/lib/stores/settings";
import { FLOOD_CLASSES } from "@/lib/status";
import { DATA_SOURCES } from "@/lib/data-sources";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-rule py-1.5 text-sm last:border-0">
      <dt className="text-ink-2">{label}</dt>
      <dd className="whitespace-nowrap font-data font-semibold text-ink">{value}</dd>
    </div>
  );
}

export function ReportApp() {
  const { params } = useMapParams();
  const { mode, horizon, date, level, vehicle } = params;
  const scene = useMapScene({ mode, horizon, date, level, vehicle });
  const weights = useSettings((state) => state.weights);
  const floodIndex = useFloodIndex();
  const top = useMemo(() => rankByPriority(scene.villages, weights, null).slice(0, 10), [scene.villages, weights]);
  const runId = scene.runId;
  const details = useQueries({
    queries: top.map((village) => ({
      queryKey: queryKeys.village(village.village_id, runId ?? ""),
      queryFn: () => dataSource.village(village.village_id, runId ?? ""),
      enabled: runId !== null,
    })),
  });
  const flood =
    floodIndex.data?.dates.find((entry) => entry.date === scene.floodDate) ?? floodIndex.data?.dates[0];
  const summary = scene.summary;
  const title =
    mode === "prakiraan" ? `Prakiraan ${horizon} jam` : mode === "radar" ? "Kondisi radar" : `Simulasi tinggi air ${formatDecimal(level)} m`;

  return (
    <div className="mx-auto max-w-[210mm] px-4 py-6 print:max-w-none print:p-0">
      <div className="no-print mb-4 flex flex-wrap justify-between gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/komando">
            <ArrowLeft /> Ruang komando
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer /> Cetak / simpan PDF
        </Button>
      </div>

      <article className="space-y-6 rounded-[6px] bg-white p-8 shadow-float print:rounded-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b-2 border-ink pb-4">
          <div>
            <p className="label-data">Laporan situasi · {scene.manifest?.region.name ?? ""}</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink-2">
              {scene.manifest?.event.name} · {scene.runTime ? `data per ${formatWib(scene.runTime)}` : ""} · kendaraan{" "}
              {vehicle === "car" ? "mobil" : "truk/4x4"}
            </p>
          </div>
          <Image src="/brand/evaku-logo-light.svg" alt="EvaKu" width={111} height={40} className="h-9 w-auto" />
        </header>

        <section className="grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <h2 className="label-data mb-2">Ringkasan</h2>
            {summary ? (
              <dl>
                <Row label="Desa terisolasi total" value={formatNumber(summary.isolatedVillages)} />
                <Row label="Desa terisolasi sebagian" value={formatNumber(summary.partialVillages)} />
                <Row label="Warga terisolasi" value={formatNumber(summary.isolatedPopulation)} />
                <Row label="Balita · lansia di desa terdampak" value={`${formatNumber(summary.children)} · ${formatNumber(summary.elderly)}`} />
                <Row label="Jalan putus" value={`${formatDecimal(summary.cutRoadKm)} km`} />
              </dl>
            ) : (
              <Skeleton className="h-32" />
            )}
          </div>
          <div>
            <h2 className="label-data mb-2">{mode === "radar" ? "Luas genangan" : "Luas genangan radar terakhir"}</h2>
            {flood ? (
              <dl>
                {FLOOD_CLASSES.map((cls) => (
                  <Row key={cls.key} label={`${cls.label} (${cls.range})`} value={`${formatDecimal(flood.area_km2[cls.key])} km²`} />
                ))}
                <Row label="Citra diambil" value={formatWib(flood.acquired_at)} />
              </dl>
            ) : (
              <Skeleton className="h-32" />
            )}
          </div>
        </section>

        <section>
          <h2 className="label-data mb-2">Peta</h2>
          <div className="h-[300px] overflow-hidden rounded-[8px] border border-rule print:h-[90mm]">
            {scene.manifest ? (
              <LazyMapCanvas
                initialBounds={scene.manifest.region.bbox}
                roads={scene.roads}
                villages={scene.fills}
                flood={scene.flood}
                interactive={false}
                navigation={false}
                preserveDrawingBuffer
                label="Peta laporan situasi"
              />
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="label-data mb-2">10 desa prioritas dan rute rekomendasi</h2>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-1.5 pr-2">#</th>
                <th className="py-1.5 pr-2">Desa</th>
                <th className="py-1.5 pr-2">Status</th>
                <th className="py-1.5 pr-2 text-right">Warga</th>
                <th className="py-1.5">Rute rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {top.map((village, index) => {
                const route = details[index]?.data?.run.route;
                return (
                  <tr key={village.village_id} className="border-b border-rule align-top">
                    <td className="py-1.5 pr-2 font-data">{village.rank}</td>
                    <td className="py-1.5 pr-2">
                      <p className="font-semibold text-ink">{village.name}</p>
                      <p className="text-muted">Kec. {village.district}</p>
                    </td>
                    <td className="py-1.5 pr-2"><VillageStatusBadge status={village.status} /></td>
                    <td className="py-1.5 pr-2 text-right font-data">{formatNumber(village.isolated_population)}</td>
                    <td className="py-1.5 text-ink-2">{route?.recommendation ?? (mode === "simulasi" ? "Lihat rute di peta simulasi" : "Lewat jalan biasa")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <footer className="border-t border-rule pt-3 text-[10px] leading-relaxed text-muted">
          Kandidat lokasi aman dan rute berdasarkan model, ikuti arahan BPBD. Sumber data:{" "}
          {DATA_SOURCES.map((source) => source.attribution).join(" · ")}. Dibuat dengan EvaKu.
        </footer>
      </article>
    </div>
  );
}
