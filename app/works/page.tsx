"use client";

import { CheckCircle2, ChevronRight, Compass, Layers, LifeBuoy, ShieldAlert, Waves } from "lucide-react";
import { useState } from "react";


const workflowSteps = [
  {
    step: "01",
    title: "Pemantauan Muka Air & Sensor",
    short: "Sensor Real-Time",
    desc: "Sensor telemetri dan integrasi pos pantau mendeteksi tren kenaikan debit air sungai serta saluran drainase secara kontinu sebelum genangan meluap ke pemukiman.",
    badge: "Deteksi Dini",
    icon: Waves,
    status: "Normal / Siaga 3",
  },
  {
    step: "02",
    title: "Simulasi Elevasi Genangan Dinamis",
    short: "Simulasi Air (+50-200cm)",
    desc: "Algoritma hidrologi memodelkan skenario kenaikan air dari +50cm hingga +200cm, memetakan kontur wilayah berisiko tinggi dan perkiraan laju rendaman air.",
    badge: "Geo-Simulation",
    icon: Layers,
    status: "Modeling Aktif",
  },
  {
    step: "03",
    title: "Deteksi Akses Jalan Terputus",
    short: "Deteksi Jalur Terisolasi",
    desc: "Sistem otomatis mendeteksi dan mengunci ruas jalan yang terendam genangan kritis, mengidentifikasi kantong pemukiman yang berpotensi terisolasi dari akses darat.",
    badge: "Analisis Risiko",
    icon: ShieldAlert,
    status: "5 Titik Kritis",
  },
  {
    step: "04",
    title: "Kalkulasi Rute Evakuasi Teraman",
    short: "Navigasi Kering Tercepat",
    desc: "Mesin pencari jalur menghitung rute alternatif tercepat di atas jalan bebas genangan dan kontur tanah tinggi, menjauhkan warga dari arus deras dan jembatan berisiko.",
    badge: "Smart Routing",
    icon: Compass,
    status: "100% Rute Aman",
  },
  {
    step: "05",
    title: "Sentralisasi Posko Komando & Medis",
    short: "Koordinasi Posko Siaga",
    desc: "Warga dipandu langsung ke posko pengungsian terdekat yang masih memiliki daya tampung aman, cadangan pangan darurat, dan tim medis yang siap siaga.",
    badge: "Penyelamatan Warga",
    icon: LifeBuoy,
    status: "Siaga 24 Jam",
  },
];


export default function Works() {
const [activeStep, setActiveStep] = useState(0);

    return (
          <section id="how" className="py-20 sm:py-28 bg-white/70 dark:bg-slate-900/60 border-y border-[#0B2A4A]/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-sky-600 dark:text-sky-400">
              Alur Penyelamatan Terpadu
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#071B30] dark:text-white">
              Bagaimana Evaku.id Memandu Warga Saat Banjir Menerjang
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#0B2A4A]/70 dark:text-slate-300">
              Dari deteksi kenaikan air hingga warga tiba di posko aman — setiap
              tahap dipandu analisis data agar tidak ada warga yang terisolasi.
            </p>
          </div>

          {/* Interactive Steps Grid & Display */}
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Step Selection Buttons (Left Column) */}
            <div className="space-y-3 lg:col-span-5">
              {workflowSteps.map((item, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                      isActive
                        ? "bg-[#0B2A4A] dark:bg-blue-600 text-white border-transparent shadow-lg shadow-blue-900/20 scale-[1.01]"
                        : "bg-white/80 dark:bg-slate-800/80 text-[#0B2A4A] dark:text-slate-200 border-[#0B2A4A]/10 dark:border-white/10 hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate">{item.title}</p>
                      </div>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isActive
                            ? "text-white/80"
                            : "text-[#0B2A4A]/60 dark:text-slate-400"
                        }`}
                      >
                        {item.short}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`shrink-0 transition-transform ${
                        isActive ? "rotate-90 text-white" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Step Detailed Card (Right Column) */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-[#0B2A4A]/15 dark:border-white/10 bg-gradient-to-br from-[#0B2A4A] to-[#071B30] p-8 sm:p-12 text-white shadow-2xl">
                {/* Visual Ambient Glow */}
                <div className="pointer-events-none absolute -right-20 -bottom-20 size-[320px] rounded-full bg-sky-500/15 blur-[80px]" />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-sky-300 border border-white/10">
                      Tahap {workflowSteps[activeStep].step} •{" "}
                      {workflowSteps[activeStep].badge}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {workflowSteps[activeStep].status}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
                    {workflowSteps[activeStep].title}
                  </h3>

                  <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-200">
                    {workflowSteps[activeStep].desc}
                  </p>

                  {/* Interactive preview diagram inside active card */}
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-3">
                      <span>Proses Verifikasi Otomatis</span>
                      <span className="text-sky-300">Status: Aktif</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-xs">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-slate-200">
                          Integrasi data elevasi topografi wilayah berisiko
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-slate-200">
                          Sinkronisasi laporan ketinggian air pos komando lapangan
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
                        <span className="text-slate-200">
                          Perhitungan matriks waktu tempuh evakuasi per rute
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="text-xs text-slate-400">
                      Langkah {activeStep + 1} dari {workflowSteps.length}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveStep((prev) =>
                            prev === 0 ? workflowSteps.length - 1 : prev - 1
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        Sebelumnya
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveStep((prev) =>
                            prev === workflowSteps.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}