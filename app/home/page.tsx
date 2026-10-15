"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  LifeBuoy,
  MapPin,
  PhoneCall,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Waves,
} from "lucide-react";


export default function HomeContent() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="min-h-screen text-[#0B2A4A] dark:text-[#E2E8F0]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28">
        {/* Soft background ambient gradient and contour grids */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-sky-200/40 dark:bg-sky-950/20 blur-[120px]" />
          <div className="absolute top-1/3 -right-24 size-[400px] rounded-full bg-blue-100/50 dark:bg-blue-900/15 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#0B2A4A_1px,transparent_1px)] dark:bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] dark:opacity-[0.05]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Pill Announcement Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-sky-600/20 bg-sky-50/80 dark:bg-sky-950/40 px-4 py-2 text-xs font-semibold tracking-wide text-sky-800 dark:text-sky-300 backdrop-blur-sm shadow-xs">
              <span className="flex size-2 rounded-full bg-sky-500 animate-pulse" />
              <Waves size={15} className="text-sky-600 dark:text-sky-400" />
              <span>SISTEM INTELIJEN BANJIR &amp; SIMULASI EVAKUASI</span>
            </div>

            {/* Main Punchy Headline */}
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-[68px] leading-[1.08] text-[#071B30] dark:text-white">
              Satu keputusan tepat,{" "}
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300">
                menyelamatkan ribuan jiwa
              </span>{" "}
              sebelum air memutus jalan.
            </h1>

            {/* Sub-headline */}
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#0B2A4A]/70 dark:text-slate-300 sm:text-lg sm:leading-8">
              Evaku.id memadukan simulasi kenaikan elevasi air, deteksi jalan
              terisolasi, dan panduan rute evakuasi teraman secara real-time
              menuju posko komando terdekat.
            </p>

            {/* Dual CTAs with modern visual cues */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/bukti"
                className="group w-full sm:w-auto inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-7 text-[15px] font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.35)] transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <Compass size={18} />
                <span>Buka Simulasi Peta Banjir</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/komando"
                className="group w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-[#0B2A4A]/15 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 px-6 text-[15px] font-semibold text-[#0B2A4A] dark:text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-[#0B2A4A]/5 dark:hover:bg-white/5 hover:border-[#0B2A4A]/30 hover:-translate-y-0.5"
              >
                <Radio size={17} className="text-rose-500 animate-pulse" />
                <span>Pantau Posko Komando</span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* Readiness & Live Impact Metric Bar */}
            <div className="mt-14 w-full max-w-4xl border-t border-[#0B2A4A]/10 dark:border-white/10 pt-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
                <div className="text-center sm:border-r sm:border-[#0B2A4A]/10 dark:sm:border-white/10 sm:last:border-r-0">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#071B30] dark:text-white font-heading">
                    42+
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0B2A4A]/60 dark:text-slate-400">
                    Titik Pantau &amp; Desa Terpetakan
                  </p>
                </div>
                <div className="text-center sm:border-r sm:border-[#0B2A4A]/10 dark:sm:border-white/10 sm:last:border-r-0">
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-sky-400 font-heading">
                    15 Mnt
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0B2A4A]/60 dark:text-slate-400">
                    Peringatan Dini Lebih Cepat
                  </p>
                </div>
                <div className="text-center sm:border-r sm:border-[#0B2A4A]/10 dark:sm:border-white/10 sm:last:border-r-0">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#071B30] dark:text-white font-heading">
                    98.4%
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0B2A4A]/60 dark:text-slate-400">
                    Akurasi Jalur Bebas Genangan
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                    24/7
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0B2A4A]/60 dark:text-slate-400">
                    Sistem Pemantauan Siaga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}