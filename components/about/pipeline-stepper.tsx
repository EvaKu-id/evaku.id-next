"use client";

import { CloudRain, Database, Megaphone, Route, Satellite } from "lucide-react";
import { Tabs } from "radix-ui";
import type { ReactNode } from "react";

interface Stage {
  id: string;
  title: string;
  icon: ReactNode;
  summary: string;
  inputs: string[];
  output: string;
}

const STAGES: readonly Stage[] = [
  {
    id: "data",
    title: "Data dasar",
    icon: <Database className="size-4" />,
    summary: "Setiap wilayah dibangun sekali: jaringan jalan dan jembatan, batas desa, warga per desa, fasilitas, dan ketinggian medan di atas sungai terdekat (HAND).",
    inputs: ["OpenStreetMap", "BPS / OCHA HDX", "WorldPop 2026", "Copernicus DEM"],
    output: "Graf jalan, desa, dan HAND per ruas",
  },
  {
    id: "forecast",
    title: "Prakiraan",
    icon: <CloudRain className="size-4" />,
    summary: "Setiap 6 jam, prakiraan hujan dan debit sungai diubah menjadi peluang banjir per desa dan tinggi air sungai untuk 24, 48, dan 72 jam.",
    inputs: ["GloFAS", "Open-Meteo", "LightGBM terkalibrasi"],
    output: "Peluang per desa + tinggi air per horizon",
  },
  {
    id: "radar",
    title: "Radar",
    icon: <Satellite className="size-4" />,
    summary: "Saat satelit Sentinel-1 lewat, U-Net memetakan genangan menembus awan. Kedalaman dihitung dari HAND, air permanen dikecualikan.",
    inputs: ["Sentinel-1 VV/VH", "U-Net ONNX", "JRC air permanen"],
    output: "Peta genangan 3 kelas kedalaman",
  },
  {
    id: "access",
    title: "Mesin akses",
    icon: <Route className="size-4" />,
    summary: "Kedalaman di setiap ruas menentukan status jalan. Jarak tempuh dari posko dihitung ulang untuk mobil dan truk, lalu setiap desa diberi status, skor prioritas, rute, dan titik evakuasi.",
    inputs: ["Status ruas", "14 posko logistik", "187 kandidat lokasi aman"],
    output: "Status desa, ranking, rute, evakuasi",
  },
  {
    id: "publish",
    title: "Publikasi",
    icon: <Megaphone className="size-4" />,
    summary: "Hasil diperiksa lalu diterbitkan sekaligus ke peta, ruang komando, laporan situasi, dan peringatan Telegram untuk desa yang berlangganan.",
    inputs: ["Peta", "Ruang komando", "Telegram"],
    output: "Keputusan posko dan warga",
  },
];

export function PipelineStepper() {
  return (
    <Tabs.Root defaultValue={STAGES[0].id} className="grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[280px_1fr]">
      <Tabs.List aria-label="Tahap kerja EvaKu" className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col" data-lenis-prevent>
        {STAGES.map((stage, index) => (
          <Tabs.Trigger
            key={stage.id}
            value={stage.id}
            className="flex shrink-0 items-center gap-3 rounded-[10px] border border-rule bg-surface px-3 py-2.5 text-left text-sm font-semibold text-ink-2 transition-colors hover:border-brand/40 data-[state=active]:border-brand data-[state=active]:bg-brand-soft data-[state=active]:text-ink"
          >
            <span className="font-data text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
            {stage.icon}
            {stage.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {STAGES.map((stage) => (
        <Tabs.Content key={stage.id} value={stage.id} className="min-w-0 rounded-[14px] border border-rule bg-surface p-5 sm:p-6">
          <h3 className="text-xl font-bold text-ink">{stage.title}</h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-2">{stage.summary}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <ul className="flex flex-wrap gap-2">
              {stage.inputs.map((input) => (
                <li key={input} className="rounded-[6px] border border-rule bg-surface-2 px-2 py-1 font-data text-xs text-ink">{input}</li>
              ))}
            </ul>
            <span aria-hidden className="hidden h-px w-16 bg-brand sm:block" />
            <p className="rounded-[10px] border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-semibold text-ink">{stage.output}</p>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
