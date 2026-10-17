import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map as MapIcon, ShieldCheck } from "lucide-react";
import { AlertPreview } from "@/components/about/alert-preview";
import { CalcBlock } from "@/components/about/calc-block";
import { EvacuationRules } from "@/components/about/evacuation-rules";
import { Faq } from "@/components/about/faq";
import { HandCrossSection } from "@/components/about/hand-cross-section";
import { IsolationDiagram } from "@/components/about/isolation-diagram";
import { PipelineStepper } from "@/components/about/pipeline-stepper";
import { ProbabilityExamples } from "@/components/about/probability-examples";
import { RadarSchematic } from "@/components/about/radar-schematic";
import { RatingCurve } from "@/components/about/rating-curve";
import { RouteSample } from "@/components/about/route-sample";
import { ThresholdColumns } from "@/components/about/threshold-columns";
import { WeightsBar } from "@/components/about/weights-bar";
import { Ornament } from "@/components/ui/ornament";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_SOURCES } from "@/lib/data-sources";
import { PHOTO_CREDITS } from "@/lib/photo-credits";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Cara kerja EvaKu dan cara menghitung peluang banjir, status jalan, desa terisolasi, titik evakuasi, dan skor prioritas.",
};

const TEAM = [
  ["Frontend", "Peta, halaman, dan pengalaman pengguna"],
  ["Backend", "Database, API publik, dan infrastruktur"],
  ["AI/ML", "Mesin akses, pipeline, dan layanan model"],
  ["ML", "Model genangan, prakiraan, dan kalibrasi"],
] as const;

export default function AboutPage() {
  return (
    <main id="konten">
      <Section bordered={false} className="overflow-hidden pt-10 sm:pt-16">
        <Ornament name="contours" className="absolute -right-24 top-0 h-[520px] w-[720px] text-brand/10" />
        <div className="relative grid grid-cols-1 items-center gap-12 [&>*]:min-w-0 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <SectionHeading
              as="h1"
              label="Tentang EvaKu"
              title="Peringatan banjir yang menjawab: jalan mana, desa mana, ke mana."
              intro="Peringatan biasa berhenti di “akan banjir”. EvaKu meneruskannya menjadi keputusan: desa yang akan terputus dari posko, jam putusnya, rute bantuan yang masih terbuka, dan tiga lokasi aman terdekat untuk warga."
            />
            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-rule pt-6">
              {[["1–3 hari", "lebih awal"], ["per desa", "bukan per kabupaten"], ["per ruas", "status jalan"]].map(([value, label]) => (
                <div key={value}>
                  <dt className="font-data text-xl font-semibold text-brand">{value}</dt>
                  <dd className="text-sm text-ink-2">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex justify-center lg:justify-end">
            <AlertPreview />
          </div>
        </div>
      </Section>

      <Section tone="surface" id="cara-kerja">
        <SectionHeading label="Cara kerja" title="Dari data terbuka sampai keputusan posko" intro="Lima tahap berjalan otomatis. Pilih tahap untuk melihat masukan dan hasilnya." />
        <div className="mt-10">
          <PipelineStepper />
        </div>
      </Section>

      <Section id="cara-menghitung">
        <SectionHeading label="Cara menghitung" title="Setiap angka punya rumus" intro="Semua perhitungan berjalan per ruas jalan dan per desa, lalu dirangkum untuk posko." />
        <div className="mt-10">
          <CalcBlock title="Ketinggian di atas sungai (HAND)" formula="kedalaman = max(0, tinggi air − HAND)" visual={<HandCrossSection />}>
            <p>HAND adalah tinggi setiap titik di atas sungai terdekat yang airnya mengalir ke sana. Saat sungai naik, titik yang HAND-nya lebih rendah dari tinggi air ikut tergenang.</p>
            <p>Geser papan duga untuk melihat kapan jalan desa mulai terbatas lalu putus.</p>
          </CalcBlock>
          <CalcBlock title="Status jalan" formula={"aman      kedalaman ≤ 30 cm\nterbatas  30–60 cm (hanya truk/4x4)\nputus     > 60 cm\njembatan  dinilai dari jalan masuknya"} visual={<ThresholdColumns />}>
            <p>Setiap ruas diberi kedalaman tertinggi di sepanjang ruas itu. Ambang mobil 30 cm dan truk 60 cm bisa diubah posko di pengaturan.</p>
            <p>Ruas yang tidak tercakup citra radar ditandai belum diketahui, bukan aman.</p>
          </CalcBlock>
          <CalcBlock title="Desa terisolasi" formula={"total     > 50% warga tak terjangkau\nsebagian  ≥ 10% warga tak terjangkau\ntertunda  waktu tempuh > 3× normal"} visual={<IsolationDiagram />}>
            <p>Waktu tempuh dihitung dari 14 posko logistik ke setiap simpul jalan, untuk jaringan normal dan jaringan banjir. Warga di simpul yang tidak bisa dicapai dihitung terisolasi.</p>
          </CalcBlock>
          <CalcBlock title="Peluang banjir per desa" formula={"fitur → LightGBM → kalibrasi isotonik\nrendah < 35% · sedang 35–70% · tinggi ≥ 70%"} visual={<ProbabilityExamples />}>
            <p>Model memakai hujan 1, 3, 7, dan 14 hari, hujan harian maksimum, kelembapan tanah, debit sungai beserta persentil dan trennya, topografi, tutupan lahan, dan bulan.</p>
            <p>Ambang “tinggi” dipilih supaya peringatan jarang salah, karena alarm palsu membuat warga berhenti percaya.</p>
          </CalcBlock>
          <CalcBlock title="Tinggi air dari debit" formula="tinggi air = a + b · ln(debit)" visual={<RatingCurve />}>
            <p>Untuk setiap tanggal banjir, dicari tinggi air yang genangannya paling cocok dengan citra satelit. Pasangan debit dan tinggi air itu membentuk kurva sungai.</p>
            <p>Prakiraan debit 24, 48, dan 72 jam lalu diubah menjadi tinggi air untuk mesin akses.</p>
          </CalcBlock>
          <CalcBlock title="Titik evakuasi" visual={<EvacuationRules />}>
            <p>Hanya desa berpeluang banjir tinggi yang diberi rekomendasi. Kandidat berasal dari sekolah, fasilitas kesehatan, kantor pemerintah, dan rumah ibadah di OpenStreetMap dan data BPBD.</p>
            <p className="font-semibold text-ink">Kandidat lokasi aman berdasarkan model, ikuti arahan BPBD.</p>
          </CalcBlock>
          <CalcBlock title="Rute bantuan dan titik perahu" formula={"rute = jalur tercepat dari posko lewat ruas yang bisa dilewati\nperahu = 10 km/jam dari titik turun terdekat"} visual={<RouteSample />}>
            <p>Kalau darat tidak sampai, rute berhenti di titik jalan terakhir yang masih bisa dicapai dan lanjut dengan perahu ke desa.</p>
          </CalcBlock>
          <CalcBlock title="Skor prioritas" formula="skor = Σ bobot × nilai komponen (0–1)" visual={<WeightsBar />}>
            <p>Desa yang terisolasi diurutkan dengan lima komponen. Setiap komponen dinormalisasi 0–1 di antara desa yang terdampak.</p>
          </CalcBlock>
          <CalcBlock title="Genangan dari radar" visual={<RadarSchematic />}>
            <p>Sentinel-1 menembus awan dan bisa dipakai siang atau malam. Air tenang memantulkan sinyal menjauh sehingga tampak gelap di citra.</p>
            <p>Sungai dan danau permanen dikeluarkan supaya tidak terbaca sebagai banjir.</p>
          </CalcBlock>
        </div>
      </Section>

      <Section tone="surface" id="sumber-data">
        <SectionHeading label="Sumber data" title="Dibangun dari data terbuka" />
        <div className="mt-8 overflow-x-auto rounded-[14px] border border-rule" data-lenis-prevent>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface-2 text-left">
              <tr>
                <th scope="col" className="label-data px-4 py-2">Sumber</th>
                <th scope="col" className="label-data px-4 py-2">Dipakai untuk</th>
                <th scope="col" className="label-data px-4 py-2">Lisensi</th>
                <th scope="col" className="label-data px-4 py-2">Atribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule bg-surface">
              {DATA_SOURCES.map((source) => (
                <tr key={source.name}>
                  <td className="px-4 py-3 font-semibold text-ink">
                    <a href={source.url} target="_blank" rel="noreferrer" className="hover:text-brand">{source.name}</a>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{source.usedFor}</td>
                  <td className="px-4 py-3 font-data text-xs text-ink">{source.license}</td>
                  <td className="px-4 py-3 text-ink-2">{source.attribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="penggunaan">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading label="Penggunaan yang bertanggung jawab" title="Peluang, bukan kepastian" />
            <ul className="mt-6 space-y-3 text-ink-2">
              <li>Setiap prakiraan ditampilkan sebagai peluang dengan kelas dan persen.</li>
              <li>Lokasi evakuasi adalah kandidat. Kandidat lokasi aman berdasarkan model, ikuti arahan BPBD.</li>
              <li>Jalan yang tidak terlihat citra ditandai belum diketahui, bukan aman.</li>
            </ul>
          </div>
          <div>
            <SectionHeading label="Tim" title="Empat peran, satu platform" />
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {TEAM.map(([role, focus]) => (
                <div key={role} className="rounded-[12px] border border-rule bg-surface p-4">
                  <dt className="font-semibold text-ink">{role}</dt>
                  <dd className="mt-1 text-sm text-ink-2">{focus}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="surface" id="faq">
        <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading label="Pertanyaan umum" title="Yang sering ditanyakan" intro="Belum menemukan jawabannya? Coba langsung di peta atau lihat bagaimana EvaKu diuji." />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link href="/map" className="group flex items-center gap-3 rounded-[12px] border border-rule bg-bg p-4 hover:border-brand/40">
                <MapIcon className="size-5 text-brand" aria-hidden />
                <span className="flex-1">
                  <span className="block font-semibold text-ink">Coba peta</span>
                  <span className="block text-sm text-ink-2">Prakiraan, radar, dan simulasi tinggi air</span>
                </span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link href="/bukti" className="group flex items-center gap-3 rounded-[12px] border border-rule bg-bg p-4 hover:border-brand/40">
                <ShieldCheck className="size-5 text-brand" aria-hidden />
                <span className="flex-1">
                  <span className="block font-semibold text-ink">Lihat bukti</span>
                  <span className="block text-sm text-ink-2">Akurasi model pada banjir nyata</span>
                </span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
          <Faq />
        </div>
      </Section>
    </main>
  );
}
