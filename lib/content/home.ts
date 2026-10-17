import { ClipboardList, CloudRain, LifeBuoy, Satellite, Truck, Users } from "lucide-react";

export const MOMENTS = [
  { when: "H−3", title: "Prakiraan", icon: CloudRain, body: "Desa diberi peluang banjir 24, 48, dan 72 jam. Posko tahu desa mana yang akan terputus dan kapan." },
  { when: "H−1", title: "Evakuasi", icon: LifeBuoy, body: "Desa berpeluang tinggi mendapat tiga lokasi aman terdekat dan jam terakhir untuk berangkat." },
  { when: "H", title: "Radar", icon: Satellite, body: "Citra Sentinel-1 memetakan genangan menembus awan. Status jalan dan desa diperbarui dari kondisi nyata." },
  { when: "H+1", title: "Bantuan", icon: Truck, body: "Ruang komando mengurutkan desa prioritas dan memberi rute darat atau titik turun perahu." },
] as const;

export const PERSONAS = [
  { icon: ClipboardList, who: "Operator BPBD", need: "Melihat desa yang akan terputus, menjelaskan prioritas, dan menyusun rencana kontinjensi.", href: "/komando", page: "Ruang komando" },
  { icon: Truck, who: "Koordinator logistik", need: "Tidak mengirim truk ke jalan yang putus; tahu rute darat dan titik turun perahu.", href: "/map?mode=radar", page: "Peta radar" },
  { icon: Users, who: "Kepala desa dan warga", need: "Tahu lokasi aman terdekat dan jam terakhir berangkat sebelum jalan tertutup air.", href: "/map?mode=prakiraan&h=72", page: "Peta prakiraan" },
] as const;
