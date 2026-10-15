'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Layers,
  MapPin,
  ShieldCheck,
  Split,
  Target,
  Users,
  Waves,
} from 'lucide-react';
import { METRICS_DATA, VILLAGE_REPLAY_VALIDATION } from './data';
import type { VillageReplayValidation } from './types';

type MapMode = 'h3' | 'hariH';
type ViewMode = 'split' | 'toggle';

const VillageMap = dynamic(() => import('./VillageMap'), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center bg-[#0B2A4A]/5 dark:bg-slate-800 text-sm text-[#0B2A4A]/50 dark:text-slate-400 rounded-xl"
      style={{ height: 360 }}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
        Memuat peta validasi...
      </div>
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

  const trueNegatives = VILLAGE_REPLAY_VALIDATION.filter(
    (v) => v.classification === 'True Negative',
  ).length;

  const precisionPct =
    truePositives + falsePositives > 0
      ? ((truePositives / (truePositives + falsePositives)) * 100).toFixed(1)
      : '0.0';

  const safeRouteMetric = METRICS_DATA.find(
    (m) => m.name === 'safe_evacuation_rate',
  );

  return (
    <div className="space-y-8">
      {/* ── KPI Bar ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="True Positive"
          value={`${truePositives} Desa`}
          valueColor="text-emerald-700 dark:text-emerald-300"
        />
        <Kpi
          icon={AlertTriangle}
          iconColor="text-amber-600 dark:text-amber-400"
          label="False Alarm (FP)"
          value={`${falsePositives} Desa`}
          valueColor="text-amber-700 dark:text-amber-300"
        />
        <Kpi
          icon={Target}
          iconColor="text-sky-600 dark:text-sky-400"
          label="Presisi H-3"
          value={`${precisionPct}%`}
          valueColor="text-sky-700 dark:text-sky-300"
          note={`Dari ${VILLAGE_REPLAY_VALIDATION.length} desa sampel`}
        />
        <Kpi
          icon={ShieldCheck}
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Rute Selamat"
          value={safeRouteMetric?.formattedValue ?? '-'}
          valueColor="text-emerald-700 dark:text-emerald-300"
          note="Metrik evaluasi model"
        />
      </div>

      {/* ── Toolbar: View Mode Switcher ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#0B2A4A]/10 dark:bg-sky-500/15 text-[#0B2A4A] dark:text-sky-400">
            <Layers size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#071B30] dark:text-white">
              Peta Komparasi Spasial
            </h2>
            <p className="text-xs text-[#0B2A4A]/60 dark:text-slate-400">
              DAS Lubuk Minturun, Kec. Koto Tangah, Kota Padang
            </p>
          </div>
        </div>

        <div className="inline-flex self-start rounded-xl bg-[#0B2A4A]/5 dark:bg-slate-800 p-1 border border-[#0B2A4A]/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-slate-700 text-[#071B30] dark:text-white shadow-sm'
                : 'text-[#0B2A4A]/60 dark:text-slate-400 hover:text-[#071B30] dark:hover:text-white'
            }`}
          >
            <Split className="size-3.5" />
            Berdampingan
          </button>
          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
              viewMode === 'toggle'
                ? 'bg-white dark:bg-slate-700 text-[#071B30] dark:text-white shadow-sm'
                : 'text-[#0B2A4A]/60 dark:text-slate-400 hover:text-[#071B30] dark:hover:text-white'
            }`}
          >
            <Eye className="size-3.5" />
            Toggle
          </button>
        </div>
      </div>

      {/* ── Toggle Tab Buttons ── */}
      {viewMode === 'toggle' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('h3')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'h3'
                ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-900/20'
                : 'bg-[#0B2A4A]/5 dark:bg-slate-800 text-[#0B2A4A]/70 dark:text-slate-300 border border-[#0B2A4A]/10 dark:border-white/10 hover:bg-[#0B2A4A]/10 dark:hover:bg-slate-700'
            }`}
          >
            Prediksi Model H-3
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hariH')}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'hariH'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/20'
                : 'bg-[#0B2A4A]/5 dark:bg-slate-800 text-[#0B2A4A]/70 dark:text-slate-300 border border-[#0B2A4A]/10 dark:border-white/10 hover:bg-[#0B2A4A]/10 dark:hover:bg-slate-700'
            }`}
          >
            Status Hari H
          </button>
        </div>
      )}

      {/* ── Map Cards ── */}
      <div
        className={`grid grid-cols-1 gap-5 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : ''
        }`}
      >
        {(viewMode === 'split' || activeTab === 'h3') && (
          <MapCard
            title="Prediksi H-3 · 72 Jam"
            subtitle="LightGBM + HAND"
            mode="h3"
            selectedVillage={selectedVillage}
            onSelectVillage={setSelectedVillage}
          />
        )}

        {(viewMode === 'split' || activeTab === 'hariH') && (
          <MapCard
            title="Status Sampel Hari H"
            subtitle="Observasi Radar + Lapangan"
            mode="hariH"
            selectedVillage={selectedVillage}
            onSelectVillage={setSelectedVillage}
          />
        )}
      </div>

      {/* ── Legends ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#0B2A4A]/10 dark:border-white/10 bg-white dark:bg-slate-900 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#071B30] dark:text-white">
            Legenda Prediksi H-3
          </h3>
          <div className="space-y-1.5">
            <LegendItem color="#e11d48" label="Terisolasi" desc="Probabilitas ≥ 0.70" />
            <LegendItem color="#f59e0b" label="Waspada" desc="Probabilitas 0.35 – 0.70" />
            <LegendItem color="#059669" label="Aman" desc="Probabilitas < 0.35" />
          </div>
        </div>

        <div className="rounded-2xl border border-[#0B2A4A]/10 dark:border-white/10 bg-white dark:bg-slate-900 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#071B30] dark:text-white">
            Legenda Status Hari H
          </h3>
          <div className="space-y-1.5">
            <LegendItem color="#e11d48" label="Terisolasi total" desc="Akses darat terputus sepenuhnya" />
            <LegendItem color="#f97316" label="Terisolasi sebagian" desc="Hanya akses terbatas" />
            <LegendItem color="#059669" label="Terjangkau" desc="Akses normal" />
          </div>
        </div>
      </div>

      {/* ── Selected Village Detail Card ── */}
      <div className="rounded-3xl border border-[#0B2A4A]/15 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* Detail Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#0B2A4A]/10 dark:border-white/10 bg-[#0B2A4A]/[0.03] dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#071B30] dark:text-white">
                {selectedVillage.name}
              </h3>
              <p className="text-xs text-[#0B2A4A]/60 dark:text-slate-400">
                Kec. {selectedVillage.district} • ID {selectedVillage.id}
              </p>
            </div>
          </div>

          <ClassificationBadge classification={selectedVillage.classification} />
        </div>

        {/* Detail Grid */}
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DetailCell
              label="Prediksi H-3"
              value={selectedVillage.predH3}
              valueClass={
                selectedVillage.predH3 === 'terisolasi'
                  ? 'text-rose-700 dark:text-rose-400'
                  : selectedVillage.predH3 === 'waspada'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
              }
            />
            <DetailCell
              label="Status Hari H"
              value={selectedVillage.actualHariH.replace(/_/g, ' ')}
              valueClass={
                selectedVillage.actualHariH === 'terisolasi_total'
                  ? 'text-rose-700 dark:text-rose-400'
                  : selectedVillage.actualHariH === 'sebagian'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
              }
            />
            <DetailCell
              label="Populasi Berisiko"
              value={selectedVillage.popAtRisk.toLocaleString('id-ID')}
              icon={<Users size={14} className="text-[#0B2A4A]/40 dark:text-slate-500" />}
            />
            <DetailCell
              label="Kedalaman Genangan"
              value={`${selectedVillage.actualFloodDepthCm} cm`}
              icon={<Waves size={14} className="text-sky-500" />}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#0B2A4A]/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={18}
                className={
                  selectedVillage.evacuationRouteStatus === 'Terputus'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }
              />
              <span className="text-sm font-bold text-[#071B30] dark:text-white">
                Rute Evakuasi:{' '}
                <span
                  className={
                    selectedVillage.evacuationRouteStatus === 'Terputus'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {selectedVillage.evacuationRouteStatus}
                </span>
              </span>
            </div>

            <span className="font-mono text-xs text-[#0B2A4A]/50 dark:text-slate-500">
              {selectedVillage.coordinates[0].toFixed(3)},{' '}
              {selectedVillage.coordinates[1].toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

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
    <section className="overflow-hidden rounded-2xl border border-[#0B2A4A]/15 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm">
      <div
        className={`flex items-center justify-between gap-2 px-5 py-3.5 text-white ${
          isPrediction
            ? 'bg-gradient-to-r from-[#0B2A4A] to-sky-900'
            : 'bg-gradient-to-r from-[#071B30] to-emerald-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`size-2.5 rounded-full ${
              isPrediction ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
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
        selectedVillage={selectedVillage}
        onSelectVillage={onSelectVillage}
      />

      <div className="border-t border-[#0B2A4A]/10 dark:border-white/10 px-4 py-2.5 text-[11px] text-[#0B2A4A]/50 dark:text-slate-500">
        Peta dasar © OpenStreetMap contributors © CARTO
      </div>
    </section>
  );
}

function Kpi({
  icon: Icon,
  iconColor,
  label,
  value,
  valueColor,
  note,
}: {
  icon: typeof CheckCircle2;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#0B2A4A]/10 dark:border-white/10 bg-white dark:bg-slate-900 p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={iconColor} />
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A4A]/50 dark:text-slate-500">
          {label}
        </p>
      </div>
      <p className={`font-mono text-xl font-extrabold ${valueColor}`}>
        {value}
      </p>
      {note && (
        <p className="mt-1.5 text-[10px] leading-tight text-[#0B2A4A]/50 dark:text-slate-500">
          {note}
        </p>
      )}
    </div>
  );
}

function LegendItem({
  color,
  label,
  desc,
}: {
  color: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1 text-xs">
      <span
        className="size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="font-semibold text-[#071B30] dark:text-white">{label}</span>
      <span className="text-[#0B2A4A]/50 dark:text-slate-500">— {desc}</span>
    </div>
  );
}

function DetailCell({
  label,
  value,
  valueClass,
  icon,
}: {
  label: string;
  value: string;
  valueClass?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A]/50 dark:text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1.5 flex items-center gap-1.5 text-sm font-bold capitalize ${
          valueClass ?? 'text-[#071B30] dark:text-white'
        }`}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}

function ClassificationBadge({
  classification,
}: {
  classification: VillageReplayValidation['classification'];
}) {
  const styles: Record<string, string> = {
    'True Positive':
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    'True Negative':
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
    'False Positive':
      'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    'False Negative':
      'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${
        styles[classification] ?? styles['True Negative']
      }`}
    >
      {classification}
    </span>
  );
}