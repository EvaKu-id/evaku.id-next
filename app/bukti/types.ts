// types.ts

export interface VillageReplayValidation {
  id: string;
  name: string;
  district: string;
  predH3: 'aman' | 'waspada' | 'terisolasi';
  actualHariH: 'terjangkau' | 'sebagian' | 'terisolasi_total';
  classification: 'True Positive' | 'True Negative' | 'False Positive' | 'False Negative';
  popAtRisk: number;
  actualFloodDepthCm: number;
  evacuationRouteStatus: 'Aman & Terjangkau' | 'Terputus';
  coordinates: [number, number];
}

export interface MetricItem {
  model: string;
  name: string;
  label: string;
  value: number;
  formattedValue: string;
  unit?: string;
  note: string;
  baseline: string;
  baselineDelta: string;
  isHigherBetter: boolean;
}

export interface CalibrationPoint {
  bin: string;
  binCenter: number;
  rawProbability: number;
  calibratedProbability: number;
  ideal: number;
  sampleCount: number;
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