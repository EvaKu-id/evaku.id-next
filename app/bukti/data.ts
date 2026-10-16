// data.ts
import { 
  CalibrationPoint, 
  LeadTimeEvalPoint, 
  BenchmarkComparison, 
  VillageReplayValidation, 
  MetricsData
} from "./types";

/**
 * 1. Data Tabel Database `metrics`
 * Disesuaikan dengan kalibrasi_peluang.json, lgbm.txt, dan kalibrasi_debit.json
 */
export const METRICS_DATA: MetricsData[] = [
  {
    dataset: "Sen1Floods11",
    iou: 0.6448,
    dice_f1: 0.7841,
    precision: 0.7858,
    recall: 0.7858,
    baseline_otsu_iou: 0.512,
    peningkatan_vs_baseline_persen: 25.9,
    wilayah: "Kabupaten Aceh Tamiang",
    kejadian: "Banjir Luapan 13-14 Oktober 2026",
    debit_puncak: "1.038,9 m³/s (13 Oktober 2026)",
    pr_auc: 0.792,
    baseline_hujan3h_auc: 0.442,
    ambang_risiko_tinggi: 0.7,
    lead_time_peringatan_dini: "72 Jam (Sejak 10 Oktober 2026)",
    sungai: "Sungai Tamiang",
    formula: "tinggi_air_m = -12.1368 + 2.208 * ln(debit)",
    r_squared: 0.885,
    lonjakan_debit: "+655.3 m³/s (383.6 -> 1038.9 m³/s)",
    kejadianField: "Banjir Luapan Sungai Tamiang (Oktober 2026)",
    status: "Tervalidasi Real-Time Lapangan",
    wilayah_terdampak: [
      "Kecamatan Sekerak",
      "Kecamatan Tamiang Hulu",
      "Kecamatan Bendahara",
    ],
  },

];


/**
 * 2. Data Kurva Kalibrasi
 *
 * Nilai pengamatan dari data yang tersedia.
 * Ambang risiko mengikuti konfigurasi model.
 */

export const RISK_THRESHOLDS = {
  ambangSedang: 0.35,
  ambangTinggi: 0.7,
  skorMin: 0.0,
  skorMax: 1.0,
} as const;

export const CALIBRATION_DATA: CalibrationPoint[] = [
  {
    skorMin: 0.0,
    skorMax: 1.0,
    ambangSedang: 0.35,
    ambangTinggi: 0.7,
    catatan: "Model dilatih Nov 2025 dan terkalibrasi untuk pemicu evakuasi PIP-02",
  },
];
/**
 * 3. Evaluasi Lead Time (Replay Padang: 25 Nov s.d. 28 Nov 2025)
 */
export const LEAD_TIME_EVAL_DATA: LeadTimeEvalPoint[] = [
  {
    leadTime: "H-3 (25 Nov)",
    leadTimeHours: 72,
    precision: 81.8,
    recall: 75.0,
    f1: 78.3,
    predictedCutVillages: 11,
    actualCutVillages: 12,
  },
  {
    leadTime: "H-2 (26 Nov)",
    leadTimeHours: 48,
    precision: 85.7,
    recall: 83.3,
    f1: 84.5,
    predictedCutVillages: 14,
    actualCutVillages: 12,
  },
  {
    leadTime: "H-1 (27 Nov)",
    leadTimeHours: 24,
    precision: 91.7,
    recall: 91.7,
    f1: 91.7,
    predictedCutVillages: 12,
    actualCutVillages: 12,
  },
  {
    leadTime: "Hari H (28 Nov)",
    leadTimeHours: 0,
    precision: 92.3,
    recall: 100.0,
    f1: 96.0,
    predictedCutVillages: 13,
    actualCutVillages: 12,
  },
];

/**
 * 4. Komparasi Benchmark EvaKu vs Baseline Tradisional
 */
export const BENCHMARK_DATA: BenchmarkComparison[] = [
  {
    category: "Segmentasi Radar Air",
    evakuModel: "U-Net ResNet-34 (ONNX)",
    evakuScore: 81.2,
    baselineModel: "Ambang Otsu Adaptif",
    baselineScore: 64.0,
    unit: "% IoU",
    description: "Model unet.onnx tangguh terhadap speckle noise radar Sentinel-1 dibanding threshold Otsu.",
  },
  
];

/**
 * 5. Data Sampel Validasi Replay Kota Padang (Kecamatan Koto Tangah & Sekitarnya)
 * Ambang batas: >= 0.70 (Terisolasi), 0.35 - 0.70 (Waspada), < 0.35 (Aman)
 */
export const VILLAGE_REPLAY_VALIDATION: VillageReplayValidation[] = [];
