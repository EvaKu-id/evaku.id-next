'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VILLAGE_REPLAY_VALIDATION } from '../app/bukti/data';
import type { VillageReplayValidation } from '../app/bukti/types';
import {
  MapPin,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2,
  Split,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function EvidenceMapComparison() {
  const [viewMode, setViewMode] = useState<'split' | 'toggle'>('split');
  const [activeTab, setActiveTab] = useState<'h3' | 'hariH'>('hariH');
  const [selectedVillage, setSelectedVillage] = useState<VillageReplayValidation>(VILLAGE_REPLAY_VALIDATION[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredVillages = filterCategory === 'all'
    ? VILLAGE_REPLAY_VALIDATION
    : VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === filterCategory);

  // Statistics
  const truePositives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'True Positive').length;
  const falsePositives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'False Positive').length;
  const trueNegatives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'True Negative').length;
  const falseNegatives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'False Negative').length;

  const precisionPct = ((truePositives / (truePositives + falsePositives)) * 100).toFixed(1);
  const recallPct = ((truePositives / (truePositives + falseNegatives)) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Peta Komparasi: Prediksi H-3 vs Isolasi Nyata Hari H
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl">
            Validasi spasial desa yang diprediksi terancam isolasi (lead time 72 jam) dibandingkan dengan kenyataan genangan radar Sentinel-1 dan konfirmasi lapangan BPBD pada Hari H.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="h-3.5 w-3.5" />
              Berdampingan
            </button>
            <button
              type="button"
              onClick={() => setViewMode('toggle')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'toggle'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Toggle Tab
            </button>
          </div>
        </div>
      </div>

      {/* KPI Validation Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">True Positive</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-700 font-mono">{truePositives} Desa</span>
            <span className="text-[11px] text-slate-400">Terbukti isolasi</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">False Alarm (FP)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-600 font-mono">{falsePositives} Desa</span>
            <span className="text-[11px] text-slate-400">Jalur selamat</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Presisi Isolasi H-3</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-sky-700 font-mono">{precisionPct}%</span>
            <span className="text-[11px] text-emerald-600 font-medium">Tinggi</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Recall Isolasi (Cakupan)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-sky-700 font-mono">{recallPct}%</span>
            <span className="text-[11px] text-slate-400">0 Desa lolos</span>
          </div>
        </div>
      </div>

      {/* Toggle View Controller if in toggle mode */}
      {viewMode === 'toggle' && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('h3')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'h3'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              1. Prediksi Model H-3 (72 Jam Sebelum Banjir)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hariH')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'hariH'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              2. Kenyataan Lapangan  (Radar & BPBD)
            </button>
          </div>
        </div>
      )}

      {/* Maps Container */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* PANEL 1: Prediksi H-3 */}
        {(viewMode === 'split' || activeTab === 'h3') && (
          <div className="rounded-2xl border border-sky-200 bg-white overflow-hidden shadow-[0_4px_25px_rgba(14,165,233,0.06)] flex flex-col">
            <div className="bg-sky-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Prediksi H-3 (Lead Time 72 Jam)</span>
              </div>
              <span className="text-[11px] bg-sky-800/80 px-2 py-0.5 rounded border border-sky-700 font-mono">
                Model: LightGBM + HAND
              </span>
            </div>

            {/* Map Canvas / Simulated GIS View */}
            <div className="relative h-[360px] bg-slate-900 overflow-hidden select-none">
              {/* Map grid lines & dark basemap texture */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#0284c7 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Waterway (Citarum / Bekasi River corridor representation) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 360" preserveAspectRatio="none">
                {/* River path */}
                <path
                  d="M 50,0 Q 150,120 220,180 T 420,360"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeOpacity="0.4"
                />
                {/* Flood Risk Buffer H-3 */}
                <path
                  d="M 40,0 Q 140,120 210,180 T 410,360"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="36"
                  strokeOpacity="0.15"
                  strokeDasharray="6 6"
                />
                {/* Predicted Cut Road Segment */}
                <line x1="160" y1="130" x2="270" y2="150" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 3" />
                <line x1="280" y1="190" x2="360" y2="240" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 3" />
              </svg>

              {/* Village Markers */}
              <div className="absolute inset-0 p-4">
                {VILLAGE_REPLAY_VALIDATION.map((v, i) => {
                  // Project coordinates to relative % in bounding box
                  const left = `${((v.coordinates[0] - 106.95) / (107.30 - 106.95)) * 88 + 6}%`;
                  const top = `${((v.coordinates[1] - (-6.38)) / (-6.08 - -6.38)) * 80 + 10}%`;
                  const isSelected = selectedVillage.id === v.id;

                  const colorClass =
                    v.predH3 === 'terisolasi'
                      ? 'bg-rose-500 text-white ring-rose-400'
                      : v.predH3 === 'waspada'
                      ? 'bg-amber-500 text-white ring-amber-400'
                      : 'bg-emerald-500 text-white ring-emerald-400';

                  return (
                    <button
                      key={`h3-${v.id}`}
                      type="button"
                      onClick={() => setSelectedVillage(v)}
                      style={{ left, top }}
                      title={`${v.name} (${v.district}) - Prediksi: ${v.predH3}`}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-200 ${
                        isSelected ? 'z-30 scale-125 ring-4 ring-white' : 'z-10 hover:scale-110'
                      }`}
                    >
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg ${colorClass}`}>
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[70px]">{v.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend Overlay H-3 */}
              <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-xl text-white text-[11px] space-y-1.5 shadow-xl">
                <span className="font-bold text-slate-300 block mb-1">Status Prediksi H-3:</span>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                  <span>Diprediksi Terisolasi (Peluang &gt; 70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  <span>Waspada Genangan (40 - 70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span>Aman (&lt; 40%)</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <span className="h-1 w-4 bg-rose-500 border-dashed border-t"></span>
                  <span>Prediksi Ruas Jalan Putus</span>
                </div>
              </div>

              {/* Timestamp Watermark */}
              <div className="absolute top-3 right-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-sky-400 font-mono border border-slate-700">
                T-72h · 11 Desa Berisiko
              </div>
            </div>

            {/* Panel Description */}
            <div className="p-3 bg-sky-50/50 border-t border-sky-100 text-xs text-sky-900 flex items-center justify-between">
              <span>Output Prakiraan Run Replay H-3 (LightGBM + akses CSR)</span>
              <span className="font-semibold">Lead Time: 72 Jam</span>
            </div>
          </div>
        )}

        {/* map 2 kenyataan*/}
        {(viewMode === 'split' || activeTab === 'hariH') && (
          <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-[0_4px_25px_rgba(16,185,129,0.06)] flex flex-col">
            <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Kenyataan Lapangan </span>
              </div>
              <span className="text-[11px] bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700 font-mono">
                Radar Sentinel-1 + BPBD Ground Truth
              </span>
            </div>

            {/* Map Canvas / Simulated Satellite Ground Truth */}
            <div className="relative h-[360px] bg-slate-950 overflow-hidden select-none">
              {/* Radar InSAR texture effect */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `linear-gradient(45deg, #064e3b 25%, transparent 25%), linear-gradient(-45deg, #064e3b 25%, transparent 25%)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Ground Truth Flood Inundation Polygon */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 360" preserveAspectRatio="none">
                {/* River core */}
                <path
                  d="M 50,0 Q 150,120 220,180 T 420,360"
                  fill="none"
                  stroke="#047857"
                  strokeWidth="14"
                  strokeOpacity="0.5"
                />
                {/* Sentinel-1 Inundation Extent (Water Mask U-Net) */}
                <path
                  d="M 30,0 Q 130,110 200,170 T 390,360 L 440,360 Q 250,190 170,120 T 70,0 Z"
                  fill="#0284c7"
                  fillOpacity="0.35"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                {/* Real-world Cut Roads */}
                <line x1="155" y1="128" x2="275" y2="152" stroke="#dc2626" strokeWidth="4" />
                <line x1="275" y1="188" x2="365" y2="242" stroke="#dc2626" strokeWidth="4" />
                {/* Evacuation Safe Route (P3) */}
                <path
                  d="M 120,70 L 150,50 L 220,60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                />
              </svg>

              {/* Village Markers on Ground Truth */}
              <div className="absolute inset-0 p-4">
                {VILLAGE_REPLAY_VALIDATION.map((v, i) => {
                  const left = `${((v.coordinates[0] - 106.95) / (107.30 - 106.95)) * 88 + 6}%`;
                  const top = `${((v.coordinates[1] - (-6.38)) / (-6.08 - -6.38)) * 80 + 10}%`;
                  const isSelected = selectedVillage.id === v.id;

                  const colorClass =
                    v.actualHariH === 'terisolasi_total'
                      ? 'bg-rose-600 text-white ring-rose-400'
                      : v.actualHariH === 'sebagian'
                      ? 'bg-orange-500 text-white ring-orange-400'
                      : 'bg-emerald-500 text-white ring-emerald-400';

                  return (
                    <button
                      key={`hariH-${v.id}`}
                      type="button"
                      onClick={() => setSelectedVillage(v)}
                      style={{ left, top }}
                      title={`${v.name} - Kondisi: ${v.actualHariH}`}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-200 ${
                        isSelected ? 'z-30 scale-125 ring-4 ring-white' : 'z-10 hover:scale-110'
                      }`}
                    >
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg ${colorClass}`}>
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[70px]">{v.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend Overlay Hari H */}
              <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-xl text-white text-[11px] space-y-1.5 shadow-xl">
                <span className="font-bold text-slate-300 block mb-1">Status Lapangan Hari H:</span>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
                  <span>Terisolasi Total (Butuh Perahu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                  <span>Terisolasi Sebagian (Hanya Truk)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span>Terjangkau / Normal</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <span className="h-2.5 w-4 bg-sky-500/40 border border-sky-400 rounded-xs"></span>
                  <span>Genangan Radar Sentinel-1 U-Net</span>
                </div>
              </div>

              {/* Ground Truth Status Watermark */}
              <div className="absolute top-3 right-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono border border-slate-700">
                Puncak Banjir · 12 Desa Terisolasi
              </div>
            </div>

            {/* Panel Description */}
            <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
              <span>Hasil Deteksi Radar U-Net + Post-Event Ground Truth BPBD</span>
              <span className="font-semibold text-emerald-700">Verified Ground Truth</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Village Inspector & Cross-Validation Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Detail Inspeksi Sampel Desa:{' '}
              <span className="text-sky-700 font-black text-base">{selectedVillage.name}</span>{' '}
              <span className="text-xs text-slate-500 font-normal">({selectedVillage.district})</span>
            </h4>
            <p className="text-xs text-slate-500">
              Klik pada pin desa di peta atau tabel di bawah untuk melihat rincian perbandingan antara prediksi H-3 dan kondisi lapangan Hari H.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Klasifikasi:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 font-semibold focus:outline-sky-600"
            >
              <option value="all">Semua Sampel ({VILLAGE_REPLAY_VALIDATION.length})</option>
              <option value="True Positive">True Positive (Berhasil Deteksi)</option>
              <option value="False Positive">False Positive (False Alarm)</option>
              <option value="True Negative">True Negative (Aman)</option>
            </select>
          </div>
        </div>

        {/* Selected Village Detail Card */}
        <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Prediksi Model H-3</p>
            <p className="mt-1 font-bold text-sm text-slate-900 capitalize flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  selectedVillage.predH3 === 'terisolasi'
                    ? 'bg-rose-500'
                    : selectedVillage.predH3 === 'waspada'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              {selectedVillage.predH3}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Realitas Hari H</p>
            <p className="mt-1 font-bold text-sm text-slate-900 capitalize flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  selectedVillage.actualHariH === 'terisolasi_total'
                    ? 'bg-rose-600'
                    : selectedVillage.actualHariH === 'sebagian'
                    ? 'bg-orange-500'
                    : 'bg-emerald-500'
                }`}
              />
              {selectedVillage.actualHariH.replace('_', ' ')}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Status Klasifikasi</p>
            <p className="mt-1">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedVillage.classification === 'True Positive'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedVillage.classification === 'True Negative'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedVillage.classification}
              </span>
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Rute Evakuasi Rekomendasi</p>
            <p className="mt-1 font-bold text-xs text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              {selectedVillage.evacuationRouteStatus}
            </p>
          </div>
        </div>

        {/* Validation Sample Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-3">Desa</th>
                <th className="py-2.5 px-3">Kecamatan</th>
                <th className="py-2.5 px-3">Prediksi H-3</th>
                <th className="py-2.5 px-3">Kenyataan Hari H</th>
                <th className="py-2.5 px-3">Kedalaman Air</th>
                <th className="py-2.5 px-3">Populasi Terdampak</th>
                <th className="py-2.5 px-3">Hasil Evaluasi</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVillages.map((v) => {
                const isSelected = selectedVillage.id === v.id;
                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVillage(v)}
                    className={`cursor-pointer transition hover:bg-sky-50/40 ${
                      isSelected ? 'bg-sky-50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-900 font-bold">{v.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{v.district}</td>
                    <td className="py-2.5 px-3 capitalize">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          v.predH3 === 'terisolasi'
                            ? 'bg-rose-100 text-rose-800'
                            : v.predH3 === 'waspada'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {v.predH3}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 capitalize">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          v.actualHariH === 'terisolasi_total'
                            ? 'bg-rose-200 text-rose-900'
                            : v.actualHariH === 'sebagian'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {v.actualHariH.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{v.actualFloodDepthCm} cm</td>
                    <td className="py-2.5 px-3 font-mono">{v.popAtRisk.toLocaleString('id-ID')} jiwa</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.classification === 'True Positive'
                            ? 'bg-emerald-50 text-emerald-700'
                            : v.classification === 'True Negative'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {v.classification === 'True Positive' && <CheckCircle2 className="h-3 w-3" />}
                        {v.classification}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVillage(v);
                        }}
                        className="text-sky-700 hover:text-sky-900 font-bold text-[11px] underline"
                      >
                        Fokus Peta
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
