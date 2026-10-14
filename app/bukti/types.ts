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