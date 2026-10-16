import type {
  ActiveRegion,
  EvacuationSites,
  FloodIndex,
  ForecastRow,
  GenericFeatureCollection,
  Hubs,
  Manifest,
  Metric,
  NationalFloods,
  ReplayEval,
  RoadState,
  Route,
  RouteParams,
  RunVillage,
  SimLevel,
  Simulation,
  SimulationParams,
  VillageDetail,
} from "@/types/data";

export interface DataSource {
  manifest(): Promise<Manifest>;
  roads(runId: string): Promise<RoadState[]>;
  villages(runId: string): Promise<RunVillage[]>;
  forecasts(): Promise<ForecastRow[]>;
  village(villageId: string, runId: string): Promise<VillageDetail>;
  simulate(params: SimulationParams, signal?: AbortSignal): Promise<Simulation>;
  simLevels(): Promise<SimLevel[]>;
  route(params: RouteParams): Promise<Route | null>;
  metrics(): Promise<Metric[]>;
  replayEval(): Promise<ReplayEval[]>;
  floodIndex(): Promise<FloodIndex>;
  floodImageUrl(date: string): string;
  lowConfidence(): Promise<GenericFeatureCollection>;
  evacuationSites(): Promise<EvacuationSites>;
  hubs(): Promise<Hubs>;
  provinces(): Promise<GenericFeatureCollection>;
  nationalFloods(): Promise<NationalFloods>;
  activeRegions(): Promise<ActiveRegion[]>;
}
