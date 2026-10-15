import { z } from "zod";


const waktu = z.iso.datetime();
const risiko = z.enum(["rendah", "sedang", "tinggi"]);

export const latestRunResponse = z.object({
  run_id: z.string(),
  status: z.enum(["berjalan", "selesai", "gagal"]),
  sumber: z.enum(["model", "cadangan"]),
  dibuat_pada: waktu,
  horizon_jam: z.number().int().positive(),
});

export const errorResponse = z.object({ kode: z.string(), pesan: z.string() });

export const ruasStatusResponse = z.object({
  run_id: z.string(),
  total: z.number().int().nonnegative(),
  data: z.array(z.object({
    ruas_id: z.string(),
    nama: z.string(),
    status: z.enum(["aman", "tergenang"]),
    kedalaman_cm: z.number().nonnegative(),
    dapat_dilalui: z.boolean(),
  })),
});

export const desaListResponse = z.object({
  run_id: z.string(),
  total: z.number().int().nonnegative(),
  data: z.array(z.object({
    desa_id: z.string(),
    nama: z.string(),
    kecamatan: z.string(),
    risiko,
    terisolasi: z.boolean(),
    populasi: z.number().int().nonnegative(),
  })),
});

const titikEvakuasi = z.object({
  id: z.string(),
  nama: z.string(),
  jenis: z.enum(["sekolah", "balai_desa", "masjid", "titik_perahu"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  kapasitas: z.number().int().positive(),
  dapat_dijangkau_darat: z.boolean(),
});

export const desaDetailResponse = z.object({
  desa_id: z.string(),
  nama: z.string(),
  kecamatan: z.string(),
  risiko,
  terisolasi: z.boolean(),
  akses_darat: z.boolean().optional(),
  populasi: z.number().int().nonnegative(),
  titik_evakuasi: z.array(titikEvakuasi).length(3),
});

export const peluangBanjirResponse = z.object({
  run_id: z.string(),
  desa_id: z.string(),
  data: z.array(z.object({
    jam_ke: z.number().int().positive(),
    peluang: z.number().min(0).max(1),
  })),
});

export const simulasiResponse = z.object({
  simulasi_id: z.string(),
  run_id: z.string(),
  sumber: z.enum(["model", "cadangan"]),
  alasan_cadangan: z.string().optional(),
  kedaluwarsa: z.boolean().optional(),
  dibuat_pada: waktu,
  parameter: z.object({
    curah_hujan_mm: z.number().nonnegative(),
    durasi_jam: z.number().positive(),
  }),
  hasil: z.object({
    luas_genangan_ha: z.number().nonnegative(),
    desa_terdampak: z.number().int().nonnegative(),
  }),
});

export const ruteResponse = z.object({
  desa_id: z.string(),
  tujuan_id: z.string(),
  mode: z.enum(["darat", "perahu"]),
  jarak_m: z.number().nonnegative(),
  durasi_menit: z.number().nonnegative(),
  geometri: z.object({
    type: z.literal("LineString"),
    coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
  }),
});

export const metrikResponse = z.object({
  run_id: z.string(),
  desa_total: z.number().int().nonnegative(),
  desa_terisolasi: z.number().int().nonnegative(),
  ruas_tergenang: z.number().int().nonnegative(),
  penduduk_terdampak: z.number().int().nonnegative(),
  akurasi_model: z.number().min(0).max(1),
});

export const komandoListResponse = z.object({
  total: z.number().int().nonnegative(),
  data: z.array(z.object({
    id: z.string(),
    teks: z.string(),
    status: z.enum(["berjalan", "selesai"]),
    dibuat_pada: waktu,
  })),
});

export const analisisResponse = z.object({
  label: z.string(),
  confidence: z.number().min(0).max(1),
});