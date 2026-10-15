'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Eye, ShieldCheck, Split } from 'lucide-react';
import { METRICS_DATA, VILLAGE_REPLAY_VALIDATION } from './data';
import type { VillageReplayValidation } from './types';

type MapMode = 'h3' | 'hariH';
type ViewMode = 'split' | 'toggle';
// MapLibre hanya boleh jalan di browser, jadi dimuat tanpa SSR.
const VillageMap = dynamic(() => import('./VillageMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center bg-slate-100 text-sm text-slate-500"
      style={{ height: 360 }}
    >
      Memuat peta...
    </div>
  ),
});

export default function BuktiMapPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeTab, setActiveTab] = useState<MapMode>('hariH');

  const [selectedVillage, setSelectedVillage] =
    useState<VillageReplayValidation>(VILLAGE_REPLAY_VALIDATION[0]);

  const truePositives = VILLAGE_REPLAY_VALIDATION.filter(
    (v) => v.classification === 'True Positive',
  ).length;

  const falsePositives = VILLAGE_REPLAY_VALIDATION.filter(
    (v) => v.classification === 'False Positive',
  ).length;

  const precisionPct =
    truePositives + falsePositives > 0
      ? ((truePositives / (truePositives + falsePositives)) * 100).toFixed(1)
      : '0.0';

  // Diambil dari METRICS_DATA agar konsisten dengan data resmi.
  const safeRouteMetric = METRICS_DATA.find(
    (m) => m.name === 'safe_evacuation_rate',
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Peta Komparasi: Prediksi H−3 vs Hari H
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Perbandingan prediksi isolasi dan status sampel wilayah DAS Lubuk
            Minturun, Kota Padang.
          </p>
        </div>

        <div className="inline-flex self-start rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
              viewMode === 'split'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Split className="h-3.5 w-3.5" />
            Berdampingan
          </button>

          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
              viewMode === 'toggle'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Toggle Tab
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
        <Kpi
          label="True Positive"
          value={`${truePositives} Desa`}
          color="text-emerald-700"
        />
        <Kpi
          label="False Alarm (FP)"
          value={`${falsePositives} Desa`}
          color="text-amber-600"
        />
        <Kpi
          label="Presisi H−3"
          value={`${precisionPct}%`}
          color="text-sky-700"
          note={`Dari ${VILLAGE_REPLAY_VALIDATION.length} desa sampel`}
        />
        <Kpi
          label="Rute Selamat"
          value={safeRouteMetric?.formattedValue ?? '-'}
          color="text-emerald-700"
          note="Metrik evaluasi model, bukan dihitung dari sampel peta"
        />
      </div>

      {viewMode === 'toggle' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('h3')}
            className={`rounded-lg px-4 py-2 text-xs font-bold ${
              activeTab === 'h3'
                ? 'bg-sky-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Prediksi Model H−3
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hariH')}
            className={`rounded-lg px-4 py-2 text-xs font-bold ${
              activeTab === 'hariH'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Status Hari H
          </button>
        </div>
      )}

      <div
        className={`grid grid-cols-1 gap-4 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : ''
        }`}
      >
        {(viewMode === 'split' || activeTab === 'h3') && (
          <MapCard
            title="Prediksi H−3 · 72 Jam"
            subtitle="LightGBM + HAND"
            mode="h3"
            selectedVillage={selectedVillage}
            onSelectVillage={setSelectedVillage}
          />
        )}

        {(viewMode === 'split' || activeTab === 'hariH') && (
          <MapCard
            title="Status Sampel Hari H"
            subtitle="Data status yang tersedia"
            mode="hariH"
            selectedVillage={selectedVillage}
            onSelectVillage={setSelectedVillage}
          />
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3">
          <h3 className="mb-2 text-xs font-bold text-slate-800">Prediksi H−3</h3>
          <Legend color="#e11d48" label="Terisolasi" />
          <Legend color="#f59e0b" label="Waspada" />
          <Legend color="#059669" label="Aman" />
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <h3 className="mb-2 text-xs font-bold text-slate-800">Status Hari H</h3>
          <Legend color="#e11d48" label="Terisolasi total" />
          <Legend color="#f97316" label="Terisolasi sebagian" />
          <Legend color="#059669" label="Terjangkau" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">
            Detail Desa:{' '}
            <span className="text-sky-700">{selectedVillage.name}</span>
          </h3>
          <span className="text-xs text-slate-500">
            {selectedVillage.district}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-4">
          <Detail label="Prediksi H−3" value={selectedVillage.predH3} />
          <Detail
            label="Status Hari H"
            value={selectedVillage.actualHariH.replace(/_/g, ' ')}
          />
          <Detail label="Klasifikasi" value={selectedVillage.classification} />

          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-500">
              Rute Evakuasi
            </p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-bold ${
                selectedVillage.evacuationRouteStatus === 'Terputus'
                  ? 'text-rose-700'
                  : 'text-emerald-700'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {selectedVillage.evacuationRouteStatus}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Detail
            label="Populasi Berisiko"
            value={selectedVillage.popAtRisk.toLocaleString('id-ID')}
          />
          <Detail
            label="Kedalaman Genangan"
            value={`${selectedVillage.actualFloodDepthCm} cm`}
          />
          <Detail
            label="Koordinat"
            value={selectedVillage.coordinates.join(', ')}
          />
        </div>
      </div>
    </div>
  );
}

function MapCard({
  title,
  subtitle,
  mode,
  selectedVillage,
  onSelectVillage,
}: {
  title: string;
  subtitle: string;
  mode: MapMode;
  selectedVillage: VillageReplayValidation;
  onSelectVillage: (village: VillageReplayValidation) => void;
}) {
  const isPrediction = mode === 'h3';

  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-white ${
        isPrediction ? 'border-sky-200' : 'border-emerald-200'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 px-4 py-3 text-white ${
          isPrediction ? 'bg-sky-900' : 'bg-emerald-950'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isPrediction ? 'bg-sky-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-xs font-bold uppercase">{title}</span>
        </div>
        <span className="text-right text-[10px] opacity-80">{subtitle}</span>
      </div>

      <VillageMap
        mode={mode}
        selectedVillage={selectedVillage}
        onSelectVillage={onSelectVillage}
      />

      <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-600">
        Peta dasar © OpenStreetMap contributors © CARTO
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  color,
  note,
}: {
  label: string;
  value: string;
  color: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-xl font-black ${color}`}>{value}</p>
      {note && <p className="mt-1 text-[10px] text-slate-500">{note}</p>}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-xs text-slate-600">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}