'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Layers,
  MapPin,
  Users,
  Baby,
  HeartPulse,
  Split,
  Eye,
} from 'lucide-react';

import { useVillages } from '@/hooks/use-villages';
import type { VillageDetails } from '@/lib/schemas/village';

type MapMode = 'h3' | 'hariH';
type ViewMode = 'split' | 'toggle';

const VillageMap = dynamic(() => import('./VillageMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-xl bg-[#0B2A4A]/5 text-sm text-[#0B2A4A]/50 dark:bg-slate-800 dark:text-slate-400"
      style={{ height: 360 }}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 animate-pulse rounded-full bg-sky-500" />
        Memuat peta...
      </div>
    </div>
  ),
});

export default function BuktiMapPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeTab, setActiveTab] = useState<MapMode>('hariH');

  // Data diambil dari API, bukan array hardcode di data.ts.
  const { villages, loading, error } = useVillages();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedVillage =
    villages.find((village) => village.village_id === selectedId) ??
    villages[0] ??
    null;
  const selectVillage = (village: VillageDetails) => setSelectedId(village.village_id);

  const totalPopulation = villages.reduce(
    (total, village) => total + (village.population ?? 0),
    0,
  );

  const totalElderly = villages.reduce(
    (total, village) => total + (village.elderly ?? 0),
    0,
  );

  const totalChildren = villages.reduce(
    (total, village) => total + (village.children_under5 ?? 0),
    0,
  );

  // Status pengambilan data API.
  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[#0B2A4A]/10 bg-white p-8 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
        <span className="mr-2 size-2 animate-pulse rounded-full bg-sky-500" />
        Memuat data desa dari API...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 dark:border-rose-900 dark:bg-slate-900">
        <h2 className="font-bold text-rose-700 dark:text-rose-400">
          Gagal memuat data desa
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {error}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Periksa endpoint API dan response JSON pada browser.
        </p>
      </div>
    );
  }

  if (villages.length === 0 || !selectedVillage) {
    return (
      <div className="rounded-2xl border border-[#0B2A4A]/10 bg-white p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
        Belum ada data desa yang tersedia.
      </div>
    );
  }

  // Mengambil pasangan koordinat pertama dari geom.
  const firstCoordinate = selectedVillage.geom?.[0]?.[0]?.[0];

  return (
    <div className="space-y-8">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi
          icon={MapPin}
          label="Jumlah Desa"
          value={String(villages.length)}
          iconColor="text-sky-600 dark:text-sky-400"
          valueColor="text-sky-700 dark:text-sky-300"
        />

        <Kpi
          icon={Users}
          label="Total Populasi"
          value={totalPopulation.toLocaleString('id-ID')}
          iconColor="text-emerald-600 dark:text-emerald-400"
          valueColor="text-emerald-700 dark:text-emerald-300"
        />

        <Kpi
          icon={HeartPulse}
          label="Penduduk Lansia"
          value={totalElderly.toLocaleString('id-ID')}
          iconColor="text-amber-600 dark:text-amber-400"
          valueColor="text-amber-700 dark:text-amber-300"
        />

        <Kpi
          icon={Baby}
          label="Anak di Bawah 5 Tahun"
          value={totalChildren.toLocaleString('id-ID')}
          iconColor="text-rose-600 dark:text-rose-400"
          valueColor="text-rose-700 dark:text-rose-300"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#0B2A4A]/10 text-[#0B2A4A] dark:bg-sky-500/15 dark:text-sky-400">
            <Layers size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#071B30] dark:text-white">
              Peta Wilayah Desa
            </h2>
            <p className="text-xs text-[#0B2A4A]/60 dark:text-slate-400">
              Visualisasi geometri dan data demografi desa
            </p>
          </div>
        </div>

        <div className="inline-flex self-start rounded-xl border border-[#0B2A4A]/10 bg-[#0B2A4A]/5 p-1 dark:border-white/10 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
              viewMode === 'split'
                ? 'bg-white text-[#071B30] shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-[#0B2A4A]/60 hover:text-[#071B30] dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Split size={14} />
            Berdampingan
          </button>

          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
              viewMode === 'toggle'
                ? 'bg-white text-[#071B30] shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-[#0B2A4A]/60 hover:text-[#071B30] dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Eye size={14} />
            Toggle
          </button>
        </div>
      </div>

      {/* Tab toggle */}
      {viewMode === 'toggle' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('h3')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'h3'
                ? 'bg-sky-700 text-white shadow-md'
                : 'border border-[#0B2A4A]/10 bg-[#0B2A4A]/5 text-[#0B2A4A]/70 hover:bg-[#0B2A4A]/10 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tampilan H-3
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hariH')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'hariH'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'border border-[#0B2A4A]/10 bg-[#0B2A4A]/5 text-[#0B2A4A]/70 hover:bg-[#0B2A4A]/10 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tampilan Hari H
          </button>
        </div>
      )}

      {/* Peta */}
      <div
        className={`grid grid-cols-1 gap-5 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : ''
        }`}
      >
        {(viewMode === 'split' || activeTab === 'h3') && (
          <MapCard
            title="Prediksi H-3"
            subtitle="Visualisasi geometri desa"
            mode="h3"
            villages={villages}
            selectedVillage={selectedVillage}
            onSelectVillage={selectVillage}
          />
        )}

        {(viewMode === 'split' || activeTab === 'hariH') && (
          <MapCard
            title="Data Wilayah"
            subtitle="Geometri dan data desa"
            mode="hariH"
            villages={villages}
            selectedVillage={selectedVillage}
            onSelectVillage={selectVillage}
          />
        )}
      </div>

      {/* Informasi desa */}
      <section className="overflow-hidden rounded-3xl border border-[#0B2A4A]/15 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0B2A4A]/10 bg-[#0B2A4A]/[0.03] px-6 py-4 dark:border-white/10 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
              <MapPin size={18} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#071B30] dark:text-white">
                {selectedVillage.name}
              </h3>
              <p className="text-xs text-[#0B2A4A]/60 dark:text-slate-400">
                {selectedVillage.regency} · {selectedVillage.district}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
            ID Desa: {selectedVillage.village_id}
          </span>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            <DetailCell
              label="Kabupaten/Kota"
              value={selectedVillage.regency}
            />

            <DetailCell
              label="Kecamatan"
              value={selectedVillage.district}
            />

            <DetailCell
              label="Total Populasi"
              value={formatCount(selectedVillage.population)}
              icon={<Users size={14} />}
            />

            <DetailCell
              label="Penduduk Lansia"
              value={formatCount(selectedVillage.elderly)}
              icon={<HeartPulse size={14} />}
            />

            <DetailCell
              label="Anak di Bawah 5 Tahun"
              value={formatCount(selectedVillage.children_under5)}
              icon={<Baby size={14} />}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0B2A4A]/10 pt-4 dark:border-white/10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A]/50 dark:text-slate-500">
                Koordinat Geometri Pertama
              </p>

              <p className="mt-1 font-mono text-xs text-[#071B30] dark:text-white">
                {firstCoordinate
                  ? `${firstCoordinate[0]}, ${firstCoordinate[1]}`
                  : 'Koordinat tidak tersedia'}
              </p>
            </div>

            <span className="text-xs text-[#0B2A4A]/50 dark:text-slate-500">
              Urutan koordinat: longitude, latitude
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatCount(value: number | null): string {
  return value === null ? '—' : value.toLocaleString('id-ID');
}

/* Kartu peta */

function MapCard({
  title,
  subtitle,
  mode,
  villages,
  selectedVillage,
  onSelectVillage,
}: {
  title: string;
  subtitle: string;
  mode: MapMode;
  villages: VillageDetails[];
  selectedVillage: VillageDetails;
  onSelectVillage: (village: VillageDetails) => void;
}) {
  const isPrediction = mode === 'h3';

  return (
    <section className="overflow-hidden rounded-2xl border border-[#0B2A4A]/15 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div
        className={`flex items-center justify-between gap-2 px-5 py-3.5 text-white ${
          isPrediction
            ? 'bg-gradient-to-r from-[#0B2A4A] to-sky-900'
            : 'bg-gradient-to-r from-[#071B30] to-emerald-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`size-2.5 animate-pulse rounded-full ${
              isPrediction ? 'bg-sky-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider">
            {title}
          </span>
        </div>

        <span className="text-right text-[11px] font-medium text-white/70">
          {subtitle}
        </span>
      </div>

      <VillageMap
        mode={mode}
        villages={villages}
        selectedVillage={selectedVillage}
        onSelectVillage={onSelectVillage}
      />

      <div className="border-t border-[#0B2A4A]/10 px-4 py-2.5 text-[11px] text-[#0B2A4A]/50 dark:border-white/10 dark:text-slate-500">
        Peta dasar © OpenStreetMap contributors © CARTO
      </div>
    </section>
  );
}

/* KPI */

function Kpi({
  icon: Icon,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: typeof MapPin;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#0B2A4A]/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className={iconColor} />
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50 dark:text-slate-500">
          {label}
        </p>
      </div>

      <p className={`font-mono text-xl font-extrabold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

/* Detail */

function DetailCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A]/50 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 flex items-center gap-1.5 break-words text-sm font-bold text-[#071B30] dark:text-white">
        {icon && (
          <span className="shrink-0 text-[#0B2A4A]/40 dark:text-slate-500">
            {icon}
          </span>
        )}
        {value}
      </p>
    </div>
  );
}