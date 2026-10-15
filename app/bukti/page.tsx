import type { Metadata } from "next";
import BuktiMapPanel from "./map-panel";

export const metadata: Metadata = {
  title: "Bukti Validasi | Evaku.id",
  description:
    "Komparasi prediksi isolasi H-3 terhadap kondisi nyata Hari H di DAS Lubuk Minturun, Kota Padang.",
};

export default function BuktiPage() {
  return (
    <main className="min-h-screen text-[#0B2A4A] dark:text-[#E2E8F0]">
      {/* Header Section */}
      <section className="pt-10 pb-8 sm:pt-16 sm:pb-12 border-b border-[#0B2A4A]/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-600/20 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-sky-800 dark:text-sky-300 uppercase mb-5">
            <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Validasi Model Prediksi Isolasi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#071B30] dark:text-white leading-[1.12] font-heading max-w-3xl">
            Komparasi Prediksi H-3 vs Kondisi Nyata Hari H
          </h1>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#0B2A4A]/70 dark:text-slate-300 max-w-2xl">
            Memvalidasi akurasi model LightGBM + HAND dalam memprediksi desa
            yang akan terisolasi banjir 72 jam sebelum kejadian, dibandingkan
            dengan observasi radar Sentinel-1 dan konfirmasi lapangan di DAS
            Lubuk Minturun, Kota Padang.
          </p>
        </div>
      </section>

      {/* Map Panel Section */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <BuktiMapPanel />
        </div>
      </section>
    </main>
  );
}