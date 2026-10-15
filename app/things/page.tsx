import { Activity } from "lucide-react";

export default function Things() {
    return (
         <section className="py-24 sm:py-32 bg-[#071B30] text-white relative overflow-hidden">
        {/* Subtle radial lights */}
        <div className="absolute top-1/4 left-1/4 size-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 size-[450px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
            {/* Sticky Overview Left Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="text-xs font-bold tracking-widest uppercase text-sky-400">
                Geo-Intelligence Engine
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl font-heading leading-[1.12]">
                Bergerak Cepat,{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Dipandu Data
                </span>{" "}
                Geospasial Presisi.
              </h2>

              <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300">
                Kami menggabungkan model elevasi digital dengan pembaruan
                kondisi lapangan. Sistem memproyeksikan pergerakan air, mendeteksi
                ruas jalan yang terputus, dan memastikan jalur penyelamatan tetap
                terbuka.
              </p>

              {/* Status Badge Card */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      Live Isolation Engine
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Menghitung status aksesibilitas jalan tiap 60 detik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Right Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Feature 01 */}
              <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-sky-500/40 hover:bg-white/[0.04]">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-xs font-extrabold tracking-widest text-sky-400/80">
                    01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    Simulasi Elevasi Banjir Dinamis
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-300 pl-7 border-l border-white/10">
                  Uji skenario kenaikan air dari ketinggian normal hingga lebih dari
                  2 meter. Lihat secara langsung desa mana yang aman dan jalan mana
                  yang mulai terendam air secara real-time.
                </p>

                {/* Progress Indicators */}
                <div className="mt-6 pl-7 space-y-3">
                  <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-rose-300 font-medium flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-rose-500" />
                        Terisolasi Total (+150cm)
                      </span>
                      <span className="font-mono text-slate-400">5 Desa</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: "20%" }} />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 mb-1.5">
                      <span className="text-amber-300 font-medium flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-500" />
                        Terisolasi Sebagian (+80cm)
                      </span>
                      <span className="font-mono text-slate-400">12 Desa</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "45%" }} />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 mb-1.5">
                      <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        Akses Terjangkau / Aman
                      </span>
                      <span className="font-mono text-slate-400">25 Desa</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 02 */}
              <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-sky-500/40 hover:bg-white/[0.04]">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-xs font-extrabold tracking-widest text-sky-400/80">
                    02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    Obstacle-Aware Routing Engine
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-300 pl-7 border-l border-white/10">
                  Ketika genangan memutus jalan protokol, mesin rute otomatis
                  mengkalkulasi jalur alternatif darat yang lebih tinggi. Mengurangi
                  risiko kendaraan terjebak di tengah jalan yang tenggelam.
                </p>
              </div>

              {/* Feature 03 */}
              <div className="group rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-sky-500/40 hover:bg-white/[0.04]">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-mono text-xs font-extrabold tracking-widest text-sky-400/80">
                    03
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    Pusat Komando &amp; Kapasitas Posko Live
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-300 pl-7 border-l border-white/10">
                  Visibilitas langsung bagi koordinator BPBD dan relawan lapangan.
                  Pantau ketersediaan kapasitas pengungsi, kebutuhan logistik air
                  bersih, makanan darurat, serta obat-obatan dari satu layar komando.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}