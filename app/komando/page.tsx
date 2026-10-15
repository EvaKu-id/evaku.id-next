"use client";

import { useEffect, useState } from "react";
import { MapView } from "@/components/map";
import {
  Activity,
  CheckCircle2,
  Database,
  MapPin,
  ShieldAlert,
  Waves,
} from "lucide-react";
import {
  publicLatestResponse,
  publicRoadsResponse,
  publicVillagesResponse,
  type PublicRoadsResponse,
  type PublicVillagesResponse,
} from "@/contracts/public-api";

const accessStatuses = [
  {
    label: "Terisolasi total",
    status: "fully_isolated",
    icon: ShieldAlert,
    color: "text-rose-700 dark:text-rose-300",
    bar: "bg-rose-600 dark:bg-rose-400",
  },
  {
    label: "Terisolasi sebagian",
    status: "partially_isolated",
    icon: Activity,
    color: "text-amber-800 dark:text-amber-300",
    bar: "bg-amber-600 dark:bg-amber-400",
  },
  {
    label: "Aman / terjangkau",
    status: "reachable",
    icon: CheckCircle2,
    color: "text-emerald-800 dark:text-emerald-300",
    bar: "bg-emerald-700 dark:bg-emerald-400",
  },
];

const usingMockData = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

interface KomandoData {
  runId: string | null;
  villages: PublicVillagesResponse;
  roads: PublicRoadsResponse;
}

export default function Komando() {
  const [data, setData] = useState<KomandoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMonitoringData() {
      try {
        const latestResponse = await fetch("/api/latest", {
          signal: controller.signal,
        });
        if (!latestResponse.ok) throw new Error("Latest run request failed");

        const latest = publicLatestResponse.parse(await latestResponse.json());
        const runId = latest.radar?.run_id ?? null;

        if (!runId) {
          setData({ runId: null, villages: [], roads: [] });
          return;
        }

        const runPath = `/api/runs/${encodeURIComponent(runId)}`;
        const [villagesResponse, roadsResponse] = await Promise.all([
          fetch(`${runPath}/villages`, { signal: controller.signal }),
          fetch(`${runPath}/roads`, { signal: controller.signal }),
        ]);
        if (!villagesResponse.ok || !roadsResponse.ok) {
          throw new Error("Run data request failed");
        }

        const [villages, roads] = await Promise.all([
          villagesResponse.json().then((body) => publicVillagesResponse.parse(body)),
          roadsResponse.json().then((body) => publicRoadsResponse.parse(body)),
        ]);

        setData({ runId, villages, roads });
      } catch {
        if (!controller.signal.aborted) setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadMonitoringData();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1800px] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <section className="mb-7 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 dark:border-slate-700 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0B2A4A] dark:text-sky-300">
              <MapPin size={16} aria-hidden="true" />
              <span>Monitoring wilayah</span>
            </div>
            <h1 className="font-(family-name:--font-heading) text-3xl font-extrabold leading-tight text-[#0B2A4A] dark:text-white sm:text-4xl">
              Peta Komando
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Pantau kondisi akses wilayah dan lokasi pemantauan dalam satu tampilan.
            </p>
          </div>

          <div className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 text-sm font-semibold text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
            <Database size={16} aria-hidden="true" />
            {usingMockData
              ? "Data contoh"
              : isLoading
                ? "Memuat data"
                : hasError
                  ? "API tidak tersedia"
                  : data?.runId ?? "Belum ada run"}
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="font-(family-name:--font-heading) text-lg font-bold text-[#0B2A4A] dark:text-white">
                  Peta interaktif
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Lokasi pemantauan dan kondisi akses
                </p>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Geser dan zoom untuk menjelajahi peta
              </span>
            </div>

            <div className="p-2 sm:p-3">
              <MapView className="h-120 min-h-120 w-full overflow-hidden rounded-md sm:h-155" />
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
                <div>
                  <h2 className="font-(family-name:--font-heading) text-lg font-bold text-[#0B2A4A] dark:text-white">
                    Ringkasan akses
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Sebaran status desa
                  </p>
                </div>
                <Waves className="mt-1 shrink-0 text-[#0B2A4A] dark:text-sky-300" size={20} aria-hidden="true" />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                <span>Total desa</span>
                <span className="font-(family-name:--font-data) font-bold">
                  {isLoading ? "..." : data?.villages.length ?? 0}
                </span>
              </div>

              {isLoading && (
                <p className="mt-5 text-sm text-slate-600 dark:text-slate-300" role="status">
                  Memuat status desa dan ruas jalan...
                </p>
              )}

              {hasError && (
                <p className="mt-5 text-sm text-rose-800 dark:text-rose-300" role="alert">
                  Data pemantauan gagal dimuat. Periksa koneksi API lalu muat ulang halaman.
                </p>
              )}

              {!isLoading && !hasError && !data?.runId && (
                <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
                  Belum ada run radar terbaru yang dipublikasikan.
                </p>
              )}

              {!isLoading && !hasError && data?.runId && data.villages.length === 0 && (
                <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
                  Belum ada data desa untuk run ini.
                </p>
              )}

              {!isLoading && !hasError && data?.villages.length ? (
                <div className="mt-5 space-y-5">
                  {accessStatuses.map((status) => {
                    const Icon = status.icon;
                    const count = data.villages.filter(
                      (village) => village.status === status.status,
                    ).length;

                    return (
                      <div key={status.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <Icon className={`shrink-0 ${status.color}`} size={17} aria-hidden="true" />
                            <span>{status.label}</span>
                          </span>
                          <span className="font-(family-name:--font-data) text-sm font-bold text-slate-950 dark:text-white">
                            {count}
                          </span>
                        </div>
                        <div
                          className="h-2 overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-700"
                          role="img"
                          aria-label={`${count} dari ${data.villages.length} desa: ${status.label}`}
                        >
                          <div
                            className={`h-full ${status.bar}`}
                            style={{ width: `${(count / data.villages.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {!isLoading && !hasError && data?.runId && (
                <dl className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-600 dark:text-slate-300">Ruas terbatas</dt>
                    <dd className="font-semibold">{data.roads.filter((road) => road.status === 1).length}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-600 dark:text-slate-300">Ruas putus</dt>
                    <dd className="font-semibold">{data.roads.filter((road) => road.status === 2).length}</dd>
                  </div>
                </dl>
              )}
            </section>

            <section className="rounded-lg border border-[#0B2A4A]/20 bg-[#0B2A4A] p-5 text-white dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert size={18} aria-hidden="true" />
                <h2 className="font-(family-name:--font-heading) font-bold">Informasi pemantauan</h2>
              </div>
              <p className="text-sm leading-6 text-slate-100">
                Verifikasi kondisi lapangan sebelum menetapkan prioritas evakuasi.
              </p>
              {usingMockData && (
                <p className="mt-4 border-t border-white/25 pt-3 text-xs leading-5 text-slate-200">
                  Angka pada ringkasan ini merupakan data contoh dan perlu dihubungkan ke sumber data aktual.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}