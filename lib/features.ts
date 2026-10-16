export type FeatureId =
  | "P1" | "P2" | "P3" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10";

export interface ProductFeature {
  id: FeatureId;
  title: string;
  summary: string;
  href: string;
  cta: string;
}

export const FEATURES: readonly ProductFeature[] = [
  {
    id: "P1",
    title: "Peta peluang banjir",
    summary: "Peluang banjir setiap desa untuk 24, 48, dan 72 jam ke depan, dalam tiga kelas.",
    href: "/map?mode=prakiraan&h=72",
    cta: "Lihat peluang",
  },
  {
    id: "P2",
    title: "Desa yang akan terisolasi",
    summary: "Daftar desa yang diperkirakan terputus dari posko, lengkap dengan jam putus dan jumlah jiwa.",
    href: "/map?mode=prakiraan&h=72&panel=desa",
    cta: "Lihat daftar desa",
  },
  {
    id: "P3",
    title: "Titik evakuasi",
    summary: "Tiga kandidat lokasi aman terdekat, rute, dan batas waktu berangkat untuk desa berpeluang tinggi.",
    href: "/map?mode=prakiraan&h=72&panel=desa",
    cta: "Lihat titik evakuasi",
  },
  {
    id: "F1",
    title: "Peta genangan radar",
    summary: "Genangan dari citra Sentinel-1 dalam tiga kelas kedalaman, per tanggal citra.",
    href: "/map?mode=radar",
    cta: "Buka radar",
  },
  {
    id: "F2",
    title: "Status jalan",
    summary: "Setiap ruas diberi status aman, terbatas, putus, atau belum diketahui, sesuai kendaraan.",
    href: "/map?mode=radar&vehicle=truck",
    cta: "Cek ruas jalan",
  },
  {
    id: "F3",
    title: "Desa terisolasi",
    summary: "Desa terisolasi total atau sebagian, dengan warga, balita, lansia, dan waktu tempuh.",
    href: "/map?mode=radar&panel=desa",
    cta: "Lihat dampak",
  },
  {
    id: "F4",
    title: "Rute darat dan perahu",
    summary: "Rute dari posko terdekat. Kalau darat tidak sampai, rute berhenti di titik turun perahu.",
    href: "/map?mode=radar&panel=desa",
    cta: "Lihat rute",
  },
  {
    id: "F5",
    title: "Ruang komando",
    summary: "Ranking desa menurut skor prioritas lima komponen, filter kecamatan, dan ringkasan.",
    href: "/komando",
    cta: "Buka komando",
  },
  {
    id: "F6",
    title: "Simulasi tinggi air",
    summary: "Geser tinggi air 0–5 m dan lihat jalan, desa, serta warga yang terdampak.",
    href: "/map?mode=simulasi&level=1.5",
    cta: "Coba simulasi",
  },
  {
    id: "F8",
    title: "Halaman bukti",
    summary: "Akurasi model genangan dan prakiraan, serta prediksi H−3 dibanding kenyataan.",
    href: "/bukti",
    cta: "Lihat bukti",
  },
  {
    id: "F7",
    title: "Laporan situasi",
    summary: "Ringkasan satu halaman siap cetak untuk rapat posko.",
    href: "/komando/laporan",
    cta: "Buka laporan",
  },
  {
    id: "F9",
    title: "Ambang dan bobot",
    summary: "Atur ambang kedalaman kendaraan dan bobot prioritas sesuai kondisi lokal.",
    href: "/komando?pengaturan=true",
    cta: "Atur",
  },
  {
    id: "F10",
    title: "Peringatan Telegram",
    summary: "Kepala desa berlangganan peringatan saat desanya berpeluang tinggi atau akan terputus.",
    href: "/map?mode=prakiraan&h=72&panel=desa",
    cta: "Berlangganan",
  },
];

export function feature(id: FeatureId): ProductFeature {
  const found = FEATURES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown feature ${id}`);
  return found;
}
