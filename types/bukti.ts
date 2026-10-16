export interface MetricsData {
  dataset: string;
  iou: number;
  dice_f1: number;
  precision: number;
  recall: number;
  baseline_otsu_iou: number;
  peningkatan_vs_baseline_persen: number;
  
  // light gbm
  wilayah: string;
  kejadian: string;
  debit_puncak: string;
  pr_auc: number;
  baseline_hujan3h_auc: number;
  ambang_risiko_tinggi: number;
  lead_time_peringatan_dini: string;
  // HydrologyCalibration
  sungai: string;
  formula: string;
  r_squared: number;
  lonjakan_debit: string;
  // FieldValidation
  kejadianField: string;
  status: string;
  wilayah_terdampak: string[];
}


export interface CalibrationPoint {
  ambangTinggi: number;
  ambangSedang: number;
  skorMax: number;
  skorMin: number;
  catatan: string;
}

export interface LeadTimeEvalPoint {
  leadTime: string;
  leadTimeHours: number;
  precision: number;
  recall: number;
  f1: number;
  predictedCutVillages: number;
  actualCutVillages: number;
}

export interface BenchmarkComparison {
  category: string;
  evakuModel: string;
  evakuScore: number;
  baselineModel: string;
  baselineScore: number;
  unit: string;
  description: string;
}