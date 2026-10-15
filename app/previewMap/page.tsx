"use client";

import { Compass, MapPin } from "lucide-react"
import Link from "next/link"


export default function previewMap () {
    return (
        
      <section className="py-20 sm:py-28 bg-[#F1F5F9] dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#0B2A4A]/15 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl">
            {/* Header info */}
            <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-sky-400">
                Peta Kesiapsiagaan Evakuasi
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#071B30] dark:text-white">
                Pantau Titik Rawan &amp; Posko Saat Ini
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#0B2A4A]/70 dark:text-slate-300 leading-relaxed">
                Setiap titik pada peta mewakili kawasan pemukiman warga dan jalur
                evakuasi darurat. Kenali status risiko wilayah Anda sebelum air meluap.
              </p>
            </div>

            {/* Map Card Mock Container */}
            <div className="relative mx-5 sm:mx-10 mb-8 h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#0B2A4A]/15 dark:border-white/10 bg-[#0B2A4A] shadow-inner">
              {/* Map Background Simulation */}
              <div className="absolute inset-0 opacity-40 mix-blend-luminosity bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

              {/* Water Wave Grid Lines */}
              <svg
                className="absolute inset-0 size-full opacity-20 pointer-events-none"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,200 Q250,150 500,220 T1000,180 L1000,600 L0,600 Z"
                  fill="#0284c7"
                />
                <path
                  d="M0,320 Q250,280 500,340 T1000,300 L1000,600 L0,600 Z"
                  fill="#0369a1"
                />
              </svg>

              {/* Floating Real-time Status Badge */}
              <div className="absolute top-5 left-5 z-20 rounded-2xl border border-white/15 bg-white/95 dark:bg-slate-900/95 p-4 shadow-lg backdrop-blur-md">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2.5">
                  Status Wilayah Terpantau
                </div>
                <div className="space-y-1.5 text-xs font-medium">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-rose-600" />
                    </span>
                    5 Desa Terisolasi Total
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    12 Terisolasi Sebagian
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    25 Akses Aman &amp; Terjangkau
                  </div>
                </div>
              </div>

              {/* Center Call to Action Floating Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/25 backdrop-blur-[1px] p-4 text-center">
                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-900/40 animate-pulse">
                  <MapPin size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm mb-2">
                  Eksplorasi Simulasi Genangan &amp; Rute
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-sm mb-5 drop-shadow-sm">
                  Sesuaikan slider ketinggian air dan temukan jalur alternatif
                  tercepat menuju posko aman.
                </p>
                <Link
                  href="/bukti"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 text-sm font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105"
                >
                  <Compass size={18} />
                  <span>Buka Peta Interaktif Lengkap</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}