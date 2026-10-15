'use client';

import { useState } from 'react';
import { Eye, MapPin, ShieldCheck, Split } from 'lucide-react';
import { VILLAGE_REPLAY_VALIDATION } from './data';
import type { VillageReplayValidation } from './types';

export default function BuktiPage() {
  const [viewMode, setViewMode] = useState<'split' | 'toggle'>('split');
  const [activeTab, setActiveTab] = useState<'h3' | 'hariH'>('hariH');
  const [selectedVillage, setSelectedVillage] = useState<VillageReplayValidation>(VILLAGE_REPLAY_VALIDATION[0]);

  // Statistik Ringkasan Evaluasi
  const truePositives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'True Positive').length;
  const falsePositives = VILLAGE_REPLAY_VALIDATION.filter((v) => v.classification === 'False Positive').length;
  const precisionPct = ((truePositives / (truePositives + falsePositives)) * 100).toFixed(1);

  // Fungsi perhitungan posisi koordinat khusus Kota Padang
  const getPadangPosition = (coords: [number, number]) => {
    const left = `${((coords[0] - 100.30) / (100.41 - 100.30)) * 75 + 12}%`;
    const top = `${((-0.80 - coords[1]) / (-0.80 - (-0.94))) * 75 + 12}%`;
    return { left, top };
  };

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Peta Komparasi: Prediksi H−3 vs Isolasi Nyata Hari H (DAS Lubuk Minturun)
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Membuktikan ketepatan deteksi dini desa terisolasi 72 jam sebelum puncak banjir terhadap kondisi lapangan aktual radar satelit dan data BPBD.
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="h-3.5 w-3.5" />
            Berdampingan
          </button>
          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              viewMode === 'toggle' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Toggle Tab
          </button>
        </div>
      </div>

      {/* KPI Validation Summary */}
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
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Rute Selamat Hari H</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-700 font-mono">94.1%</span>
            <span className="text-[11px] text-slate-400">32/34 Titik</span>
          </div>
        </div>
      </div>
      {viewMode === 'toggle' && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('h3')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'h3' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              1. Prediksi Model H−3 (72 Jam Sebelum Banjir)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hariH')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'hariH' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              2. Kenyataan Lapangan Hari H (Radar &amp; BPBD)
            </button>
          </div>
        </div>
      )}

      {/* Container Dua Peta Komparasi */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* PANEL PETA 1: PREDIKSI H-3 */}
        {(viewMode === 'split' || activeTab === 'h3') && (
          <div className="rounded-2xl border border-sky-200 bg-white overflow-hidden shadow-[0_4px_25px_rgba(14,165,233,0.06)] flex flex-col">
            <div className="bg-sky-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Prediksi H−3 (Lead Time 72 Jam)</span>
              </div>
              <span className="text-[11px] bg-sky-800/80 px-2 py-0.5 rounded border border-sky-700 font-mono">
                Model: LightGBM + HAND
              </span>
            </div>

            {/* Kanvas Peta Interaktif Sisi H-3 */}
            <div className="relative h-[360px] bg-slate-950 overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 360" preserveAspectRatio="none">
                {/* Garis Pantai Samudera Hindia di sisi barat (kiri) */}
                <path d="M 0,0 L 50,0 Q 60,180 40,360 L 0,360 Z" fill="#0369a1" fillOpacity="0.3" />
                <line x1="50" y1="0" x2="40" y2="360" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="12" y="180" fill="#38bdf8" fontSize="9" opacity="0.6" transform="rotate(-90 12 180)">
                  SAMUDERA HINDIA
                </text>

                {/* Sungai Lubuk Minturun (Mengalir dari bukit timur ke muara laut) */}
                <path d="M 500,100 Q 300,120 180,135 T 45,150" fill="none" stroke="#0284c7" strokeWidth="10" strokeOpacity="0.9" />

                {/* Koridor Prediksi Risiko Luapan Banjir H-3 (Buffer HAND) */}
                <path
                  d="M 500,75 Q 300,95 180,110 T 45,125 L 45,175 Q 180,160 300,145 T 500,125 Z"
                  fill="#f43f5e"
                  fillOpacity="0.25"
                  stroke="#fb7185"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Prediksi Ruas Jalan Putus saat H-3 */}
                <line x1="120" y1="120" x2="190" y2="138" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 3" />
                <line x1="250" y1="112" x2="330" y2="124" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 3" />
              </svg>

              {/* Pin Marker Kelurahan / Desa (Sekarang muncul tepat di layar!) */}
              <div className="absolute inset-0 p-2">
                {VILLAGE_REPLAY_VALIDATION.map((v) => {
                  const pos = getPadangPosition(v.coordinates);
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
                      style={{ left: pos.left, top: pos.top }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                        isSelected ? 'z-30 scale-125 ring-4 ring-white' : 'z-10 hover:scale-110'
                      }`}
                    >
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg ${colorClass}`}>
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[80px]">{v.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend H-3 */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl text-white text-[10px] space-y-1 shadow-xl">
                <span className="font-bold text-slate-300 block">Status Prediksi H−3:</span>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span><span>Peluang Terisolasi (&gt; 70%)</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span><span>Waspada (35–70%)</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span><span>Aman (&lt; 35%)</span></div>
              </div>
            </div>

            <div className="p-3 bg-sky-50/50 border-t border-sky-100 text-xs text-sky-900 flex justify-between">
              <span>Hasil Prakiraan Model LightGBM + Akses Graf CSR</span>
              <span className="font-semibold">T-72 Jam</span>
            </div>
          </div>
        )}

        {/* PANEL PETA 2: KENYATAAN HARI H */}
        {(viewMode === 'split' || activeTab === 'hariH') && (
          <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-[0_4px_25px_rgba(16,185,129,0.06)] flex flex-col">
            <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Kenyataan Lapangan Hari H</span>
              </div>
              <span className="text-[11px] bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700 font-mono">
                Radar Sentinel-1 + BPBD Ground Truth
              </span>
            </div>

            {/* Kanvas Peta Interaktif Sisi Hari H */}
            <div className="relative h-[360px] bg-slate-950 overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 360" preserveAspectRatio="none">
                {/* Pantai Barat Padang */}
                <path d="M 0,0 L 50,0 Q 60,180 40,360 L 0,360 Z" fill="#0369a1" fillOpacity="0.3" />
                <line x1="50" y1="0" x2="40" y2="360" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Sungai */}
                <path d="M 500,100 Q 300,120 180,135 T 45,150" fill="none" stroke="#047857" strokeWidth="10" strokeOpacity="0.8" />
                
                {/* Genangan Radar Sentinel-1 U-Net */}
                <path
                  d="M 480,85 Q 310,105 185,120 T 45,135 L 45,168 Q 185,150 310,135 T 480,115 Z"
                  fill="#0ea5e9"
                  fillOpacity="0.45"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                
                {/* Jalan Terputus Nyata */}
                <line x1="115" y1="118" x2="195" y2="136" stroke="#dc2626" strokeWidth="4" />
                <line x1="245" y1="110" x2="335" y2="124" stroke="#dc2626" strokeWidth="4" />

                {/* Rute Evakuasi Selamat (P3) */}
                <path d="M 270,65 L 230,55 L 140,70 L 110,100" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4 2" />
              </svg>

              {/* Pin Marker Lapangan */}
              <div className="absolute inset-0 p-2">
                {VILLAGE_REPLAY_VALIDATION.map((v) => {
                  const pos = getPadangPosition(v.coordinates);
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
                      style={{ left: pos.left, top: pos.top }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                        isSelected ? 'z-30 scale-125 ring-4 ring-white' : 'z-10 hover:scale-110'
                      }`}
                    >
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg ${colorClass}`}>
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[80px]">{v.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend Hari H */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl text-white text-[10px] space-y-1 shadow-xl">
                <span className="font-bold text-slate-300 block">Kenyataan Hari H:</span>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-600"></span><span>Terisolasi Total (Butuh Perahu)</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500"></span><span>Terisolasi Sebagian (Hanya Truk)</span></div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span><span>Terjangkau / Aman</span></div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/50 border-t border-emerald-100 text-xs text-emerald-900 flex justify-between">
              <span>Hasil Radar Sentinel-1 U-Net &amp; Konfirmasi BPBD</span>
              <span className="font-semibold text-emerald-700">Puncak Banjir</span>
            </div>
          </div>
        )}
      </div>

      {/* Kartu Detail Desa yang Dipilih */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Detail Inspeksi Sampel Desa:{' '}
            <span className="text-sky-700 font-black text-base">{selectedVillage.name}</span>{' '}
            <span className="text-xs text-slate-500 font-normal">({selectedVillage.district})</span>
          </h3>
          <span className="text-xs text-slate-500">Klik pin desa pada peta untuk berganti inspeksi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/60">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Prediksi Model H-3</p>
            <p className="mt-1 font-bold text-sm text-slate-900 capitalize">{selectedVillage.predH3}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Realitas Hari H</p>
            <p className="mt-1 font-bold text-sm text-slate-900 capitalize">{selectedVillage.actualHariH.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Klasifikasi</p>
            <p className="mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {selectedVillage.classification}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Rute Evakuasi (P3)</p>
            <p className="mt-1 font-bold text-xs text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              {selectedVillage.evacuationRouteStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}