import Image from "next/image";
import { Waves } from "lucide-react";

export const metadata = {
  title: "Tentang Kami | Evaku.id",
  description:
    "Latar belakang, metodologi, dan tujuan inisiatif Evaku.id dalam membantu evakuasi banjir terarah di Indonesia.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen text-[#0B2A4A] dark:text-[#E2E8F0] pb-24">
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#0B2A4A]/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-600/20 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-sky-800 dark:text-sky-300 uppercase mb-6">
            <Waves size={14} className="text-sky-600 dark:text-sky-400" />
            <span>Tentang Inisiatif Evaku.id</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#071B30] dark:text-white leading-[1.12] font-heading max-w-4xl">
            Informasi rute yang akurat adalah pembeda antara keselamatan dan kepanikan saat banjir datang.
          </h1>

          <p className="mt-8 text-base sm:text-xl leading-relaxed text-[#0B2A4A]/75 dark:text-slate-300 max-w-3xl">
            Evaku.id dikembangkan untuk menjawab satu persoalan mendasar di kawasan rawan genangan: saat air mulai naik, warga sering kali tidak tahu ruas jalan mana yang masih aman dilalui dan posko mana yang siap menerima pengungsi.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 border-b border-[#0B2A4A]/10 dark:border-white/10 bg-white/60 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#0B2A4A]/15 dark:border-white/10 bg-slate-200 dark:bg-slate-800 shadow-md">
                <Image
                  src="/banjir.webp"
                  alt="Kondisi banjir melanda pemukiman warga"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B30]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white/90">
                  <span className="font-semibold block">Dokumentasi Lapangan</span>
                  Jalan protokol yang terputus air memaksa warga mencari rute alternatif secara mandiri.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Latar Belakang
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071B30] dark:text-white leading-snug">
                Banjir tidak hanya merendam rumah, tetapi juga memutus akses bantuan.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#0B2A4A]/75 dark:text-slate-300">
                Dalam banyak kejadian banjir luapan sungai atau curah hujan ekstrem di wilayah perkotaan dan cekungan, proses evakuasi kerap terhambat bukan karena ketiadaan kendaraan evakuasi, melainkan karena armada terhadang ruas jalan yang sudah terendam melebihi batas aman.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-[#0B2A4A]/75 dark:text-slate-300">
                Evaku.id hadir sebagai jembatan data antara ketinggian air, jaringan jalan darat, dan kesiapan posko pengungsian agar keputusan diambil berdasarkan kondisi nyata, bukan perkiraan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}