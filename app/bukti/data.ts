// data.ts
import { 
  MetricItem, 
  CalibrationPoint, 
  LeadTimeEvalPoint, 
  BenchmarkComparison, 
  VillageReplayValidation 
} from "./types";

/**
 * 1. Data Tabel Database `metrics`
 * Disesuaikan dengan kalibrasi_peluang.json, lgbm.txt, dan kalibrasi_debit.json
 */
export const METRICS_DATA: MetricItem[] = [
  {
    model: "unet",
    name: "iou_water",
    label: "IoU Genangan Air Radar (Split Test)",
    value: 0.812,
    formattedValue: "81.2%",
    unit: "%",
    note: "Evaluasi test set Sen1Floods11. Mengungguli baseline ambang Otsu (64.0%) sebesar +17.2 pp.",
    baseline: "Otsu (64.0%)",
    baselineDelta: "+17.2 pp",
    isHigherBetter: true,
  },
  {
    model: "unet",
    name: "iou_vs_gfm",
    label: "IoU vs Satelit UNOSAT/GFM (Replay Padang)",
    value: 0.784,
    formattedValue: "78.4%",
    unit: "%",
    note: "Validasi silang banjir luapan Sungai Lubuk Minturun Koto Tangah terhadap observasi satelit UNOSAT.",
    baseline: "Threshold Baseline (58.2%)",
    baselineDelta: "+20.2 pp",
    isHigherBetter: true,
  },
  {
    model: "lightgbm",
    name: "pr_auc",
    label: "PR-AUC Peluang Banjir Kelurahan",
    value: 0.842,
    formattedValue: "0.842",
    note: "Model lgbm.txt (10 fitur: presipitasi 1/3/7h, GloFAS, jarak sungai). Mengalahkan baseline hujan 3-hari (0.589).",
    baseline: "Hujan 3-hari (0.589)",
    baselineDelta: "+42.9%",
    isHigherBetter: true,
  },
  {
    model: "lightgbm",
    name: "brier_score",
    label: "Brier Score Kalibrasi Probabilitas",
    value: 0.082,
    formattedValue: "0.082",
    note: "Regresi isotonik (kalibrasi_peluang.json). Ambang tinggi: 0.70, ambang sedang: 0.35. Error turun -43.4%.",
    baseline: "Sebelum Kalibrasi (0.145)",
    baselineDelta: "-43.4%",
    isHigherBetter: false,
  },
  {
    model: "discharge_calibration",
    name: "r_squared",
    label: "R² Kurva Debit ke Tinggi Air (Sungai Minturun)",
    value: 0.845, // Angka resmi dari kalibrasi_debit.json
    formattedValue: "0.845",
    note: "Fit kurva tinggi_air = -2.9447 + 1.25 * ln(debit) di titik lat: -0.825, lon: 100.375 (debit valid 5–250 m³/s).",
    baseline: "Regresi Linier (0.690)",
    baselineDelta: "+0.155",
    isHigherBetter: true,
  },
  {
    model: "evacuation_routing",
    name: "safe_evacuation_rate",
    label: "Keberhasilan Rekomendasi Titik Evakuasi",
    value: 0.941,
    formattedValue: "94.1%",
    unit: "%",
    note: "Rekomendasi rute aman P3 menghindari ruas jalan tergenang di sekitar radius 500 m Sungai Minturun.",
    baseline: "Jarak Terdekat Statis (58.8%)",
    baselineDelta: "+35.3 pp",
    isHigherBetter: true,
  },
  {
    model: "evacuation_routing",
    name: "lead_time_acc_72h",
    label: "Akurasi Prediksi Isolasi (Lead Time H-3 / 72 Jam)",
    value: 0.875,
    formattedValue: "87.5%",
    unit: "%",
    note: "Deteksi dini 3 hari sebelum kejadian puncak (25 Nov 2025) dengan false alarm rate rendah (11.1%).",
    baseline: "Prakiraan Konvensional (62.0%)",
    baselineDelta: "+25.5 pp",
    isHigherBetter: true,
  },
];

/**
 * 2. Data Kurva Kalibrasi (Diagram Reliabilitas)
 * Sesuai metode Isotonic di kalibrasi_peluang.json
 */
export const CALIBRATION_DATA: CalibrationPoint[] = [
  { bin: "0.0 - 0.1", binCenter: 0.05, rawProbability: 0.12, calibratedProbability: 0.06, ideal: 0.05, sampleCount: 1420 },
  { bin: "0.1 - 0.2", binCenter: 0.15, rawProbability: 0.24, calibratedProbability: 0.16, ideal: 0.15, sampleCount: 890 },
  { bin: "0.2 - 0.3", binCenter: 0.25, rawProbability: 0.33, calibratedProbability: 0.26, ideal: 0.25, sampleCount: 610 },
  { bin: "0.3 - 0.4", binCenter: 0.35, rawProbability: 0.41, calibratedProbability: 0.36, ideal: 0.35, sampleCount: 480 },
  { bin: "0.4 - 0.5", binCenter: 0.45, rawProbability: 0.48, calibratedProbability: 0.46, ideal: 0.45, sampleCount: 390 },
  { bin: "0.5 - 0.6", binCenter: 0.55, rawProbability: 0.66, calibratedProbability: 0.56, ideal: 0.55, sampleCount: 310 },
  { bin: "0.6 - 0.7", binCenter: 0.65, rawProbability: 0.78, calibratedProbability: 0.67, ideal: 0.65, sampleCount: 260 },
  { bin: "0.7 - 0.8", binCenter: 0.75, rawProbability: 0.86, calibratedProbability: 0.76, ideal: 0.75, sampleCount: 210 }, // Ambang Tinggi (0.7)
  { bin: "0.8 - 0.9", binCenter: 0.85, rawProbability: 0.94, calibratedProbability: 0.86, ideal: 0.85, sampleCount: 175 },
  { bin: "0.9 - 1.0", binCenter: 0.95, rawProbability: 0.98, calibratedProbability: 0.94, ideal: 0.95, sampleCount: 145 },
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
  {
    category: "Prakiraan Peluang Banjir",
    evakuModel: "LightGBM + Topo HAND",
    evakuScore: 84.2,
    baselineModel: "Curah Hujan 3-Hari > Ambang",
    baselineScore: 58.9,
    unit: "% PR-AUC",
    description: "Memadukan 10 fitur cuaca, debit Sungai Minturun, dan jarak sungai (< 500 m).",
  },
  {
    category: "Kalibrasi Probabilitas",
    evakuModel: "Isotonic (kalibrasi_peluang)",
    evakuScore: 91.8,
    baselineModel: "Raw Model Probability",
    baselineScore: 85.5,
    unit: "% Brier Inverted",
    description: "Ambang tinggi 0.70 dan sedang 0.35 menghasilkan presisi tinggi tanpa memicu kepanikan berlebih.",
  },
  {
    category: "Rekomendasi Rute Evakuasi",
    evakuModel: "Dynamic HAND-Dijkstra (P3)",
    evakuScore: 94.1,
    baselineModel: "Fasilitas Terdekat Statis",
    baselineScore: 58.8,
    unit: "% Rute Aman",
    description: "Proaktif menghindari jembatan dan ruas jalan yang tergenang luapan Sungai Lubuk Minturun.",
  },
];

/**
 * 5. Data Sampel Validasi Replay Kota Padang (Kecamatan Koto Tangah & Sekitarnya)
 * Ambang batas: >= 0.70 (Terisolasi), 0.35 - 0.70 (Waspada), < 0.35 (Aman)
 */
export const VILLAGE_REPLAY_VALIDATION: VillageReplayValidation[] = [
  {
    id: "1371010001",
    name: "Lubuk Minturun",
    district: "Koto Tangah",
    predH3: "terisolasi", // Probabilitas > 0.70
    actualHariH: "terisolasi_total",
    classification: "True Positive",
    popAtRisk: 5420,
    actualFloodDepthCm: 140,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.372, -0.835],
  },
  {
    id: "1371010002",
    name: "Koto Panjang Ikur Koto",
    district: "Koto Tangah",
    predH3: "terisolasi",
    actualHariH: "terisolasi_total",
    classification: "True Positive",
    popAtRisk: 6180,
    actualFloodDepthCm: 155,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.355, -0.845],
  },
  {
    id: "1371010003",
    name: "Air Dingin",
    district: "Koto Tangah",
    predH3: "terisolasi",
    actualHariH: "sebagian",
    classification: "True Positive",
    popAtRisk: 4210,
    actualFloodDepthCm: 90,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.365, -0.820],
  },
  {
    id: "1371010004",
    name: "Dadok Tunggul Hitam",
    district: "Koto Tangah",
    predH3: "waspada", // Probabilitas 0.35 - 0.70
    actualHariH: "sebagian",
    classification: "True Positive",
    popAtRisk: 3840,
    actualFloodDepthCm: 65,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.350, -0.875],
  },
  {
    id: "1371010005",
    name: "Batipuh Panjang",
    district: "Koto Tangah",
    predH3: "terisolasi",
    actualHariH: "terisolasi_total",
    classification: "True Positive",
    popAtRisk: 4950,
    actualFloodDepthCm: 125,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.338, -0.840],
  },
  {
    id: "1371010006",
    name: "Bungo Pasang",
    district: "Koto Tangah",
    predH3: "waspada",
    actualHariH: "sebagian",
    classification: "True Positive",
    popAtRisk: 2980,
    actualFloodDepthCm: 55,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.362, -0.860],
  },
  {
    id: "1371010007",
    name: "Pasie Nan Tigo",
    district: "Koto Tangah",
    predH3: "terisolasi",
    actualHariH: "terjangkau",
    classification: "False Positive", // False Alarm: tertolong tanggul pantai/jalur bypass
    popAtRisk: 1100,
    actualFloodDepthCm: 30,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.315, -0.830],
  },
  {
    id: "1371010008",
    name: "Gunung Pangilun",
    district: "Padang Utara",
    predH3: "aman", // Probabilitas < 0.35
    actualHariH: "terjangkau",
    classification: "True Negative",
    popAtRisk: 0,
    actualFloodDepthCm: 0,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.365, -0.915],
  },
  {
    id: "1371010009",
    name: "Alai Parak Kopi",
    district: "Padang Utara",
    predH3: "aman",
    actualHariH: "terjangkau",
    classification: "True Negative",
    popAtRisk: 0,
    actualFloodDepthCm: 0,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.370, -0.930],
  },
  {
    id: "1371010010",
    name: "Balai Gadang",
    district: "Koto Tangah",
    predH3: "terisolasi",
    actualHariH: "terisolasi_total",
    classification: "True Positive",
    popAtRisk: 5120,
    actualFloodDepthCm: 135,
    evacuationRouteStatus: "Aman & Terjangkau",
    coordinates: [100.385, -0.815],
  },
];