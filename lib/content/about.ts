import { CloudRain, Database, Megaphone, Route, Satellite, Send, type LucideIcon } from "lucide-react";

export interface PipelineStage {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  inputs: string[];
  output: string;
}

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  {
    id: "data",
    title: "Data dasar",
    icon: Database,
    summary: "Setiap wilayah dibangun sekali: jaringan jalan dan jembatan, batas desa, warga per desa, fasilitas, dan ketinggian medan di atas sungai terdekat (HAND).",
    inputs: ["OpenStreetMap", "BPS / OCHA HDX", "WorldPop 2026", "Copernicus DEM"],
    output: "Graf jalan, desa, dan HAND per ruas",
  },
  {
    id: "forecast",
    title: "Prakiraan",
    icon: CloudRain,
    summary: "Setiap 6 jam, prakiraan hujan dan debit sungai diubah menjadi peluang banjir per desa dan tinggi air sungai untuk 24, 48, dan 72 jam.",
    inputs: ["GloFAS", "Open-Meteo", "LightGBM terkalibrasi"],
    output: "Peluang per desa + tinggi air per horizon",
  },
  {
    id: "radar",
    title: "Radar",
    icon: Satellite,
    summary: "Saat satelit Sentinel-1 lewat, U-Net memetakan genangan menembus awan. Kedalaman dihitung dari HAND, air permanen dikecualikan.",
    inputs: ["Sentinel-1 VV/VH", "U-Net ONNX", "JRC air permanen"],
    output: "Peta genangan 3 kelas kedalaman",
  },
  {
    id: "access",
    title: "Mesin akses",
    icon: Route,
    summary: "Kedalaman di setiap ruas menentukan status jalan. Jarak tempuh dari posko dihitung ulang untuk mobil dan truk, lalu setiap desa diberi status, skor prioritas, rute, dan titik evakuasi.",
    inputs: ["Status ruas", "14 posko logistik", "187 kandidat lokasi aman"],
    output: "Status desa, ranking, rute, evakuasi",
  },
  {
    id: "publish",
    title: "Publikasi",
    icon: Megaphone,
    summary: "Hasil diperiksa lalu diterbitkan sekaligus ke peta, ruang komando, laporan situasi, dan peringatan Telegram untuk desa yang berlangganan.",
    inputs: ["Peta", "Ruang komando", "Telegram"],
    output: "Keputusan posko dan warga",
  },
];


export const EVACUATION_RULES = [
  ["≥ L + 1 m", "HAND lokasi minimal satu meter di atas tinggi air prakiraan"],
  ["72 jam", "Tidak tergenang pada horizon prakiraan mana pun"],
  ["≤ 10 km", "Bisa dicapai lewat ruas yang tidak putus"],
  ["4 km/jam", "Waktu jalan kaki; waktu kendaraan dari kecepatan ruas"],
  ["3 lokasi", "Diurutkan dari waktu tempuh tercepat"],
  ["Batas berangkat", "Horizon pertama saat rute ke lokasi itu terputus"],
] as const;

export const FAQ_ITEMS = [
  ["Apakah EvaKu menggantikan peringatan BMKG atau BPBD?", "Tidak. EvaKu melengkapi peringatan resmi dengan informasi akses: jalan mana yang putus, desa mana yang terisolasi, dan ke mana warga bisa mengungsi. Keputusan evakuasi tetap mengikuti arahan BPBD."],
  ["Seberapa sering data diperbarui?", "Prakiraan diperbarui setiap 6 jam. Peta genangan diperbarui setiap kali satelit Sentinel-1 melintas, biasanya setiap beberapa hari dan lebih sering saat kejadian besar."],
  ["Bagaimana wilayah baru ditambahkan?", "Per kabupaten: jaringan jalan, batas desa, warga, dan HAND dibangun dari data terbuka, lalu sungai utamanya dikalibrasi dengan debit. Setelah itu wilayah tampil di peta nasional sebagai wilayah aktif."],
  ["Apakah EvaKu bisa dipakai tanpa login?", "Bisa. Peta, detail desa, ruang komando, dan halaman bukti terbuka untuk umum. Pengaturan ambang dan bobot disimpan di perangkat masing-masing."],
  ["Bagaimana warga menerima peringatan?", "Kepala desa atau warga berlangganan lewat bot Telegram dengan kode desa. Pesan dikirim saat desa berpeluang tinggi banjir atau diperkirakan terputus."],
] as const;

export const DATA_UPDATES = [
  { icon: CloudRain, when: "Tiap 6 jam", what: "Prakiraan peluang banjir 24, 48, dan 72 jam" },
  { icon: Satellite, when: "Tiap satelit lewat", what: "Peta genangan radar dan status jalan" },
  { icon: Send, when: "Saat status berubah", what: "Peringatan Telegram untuk desa yang berlangganan" },
  { icon: Database, when: "Per rilis data", what: "Jaringan jalan, batas desa, warga, dan ketinggian medan" },
] as const;
