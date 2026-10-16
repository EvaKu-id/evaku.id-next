import { z } from "zod";

const lngLat = z.tuple([z.number(), z.number()]);
const bbox = z.tuple([z.number(), z.number(), z.number(), z.number()]);

export const villageStatusEnum = z.enum(["reachable", "partially_isolated", "fully_isolated"]);
export const vehicleEnum = z.enum(["car", "truck"]);
export const horizonEnum = z.union([z.literal(24), z.literal(48), z.literal(72)]);
const roadStatusCode = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

export const regionSchema = z.object({
  region_id: z.string(),
  name: z.string(),
  province: z.string(),
  bbox,
  center: lngLat,
  river: z.object({ river_id: z.string(), name: z.string() }),
  districts: z.array(z.string()),
  villages: z.number().int(),
  roads: z.number().int(),
  road_km: z.number(),
  bridges: z.number().int(),
  population: z.number().int(),
  hubs: z.number().int(),
  evacuation_sites: z.number().int(),
});

export const forecastRunSchema = z.object({
  run_id: z.string(),
  data_time: z.string(),
  horizon_hours: horizonEnum,
  water_level_m: z.number(),
  discharge_m3s: z.number(),
});

export const radarRunSchema = z.object({
  run_id: z.string(),
  date: z.string(),
  data_time: z.string(),
  acquired_at: z.string(),
  water_level_m: z.number(),
  discharge_m3s: z.number(),
});

export const manifestSchema = z.object({
  data_version: z.string(),
  generated_at: z.string(),
  region: regionSchema,
  event: z.object({ name: z.string(), peak_date: z.string() }),
  latest: z.object({
    radar: z.object({ run_id: z.string(), data_time: z.string() }).nullable(),
    forecasts: z.array(
      z.object({ run_id: z.string(), data_time: z.string(), horizon_hours: horizonEnum }),
    ),
  }),
  forecast_runs: z.array(forecastRunSchema),
  radar_runs: z.array(radarRunSchema),
});

export const roadStatusSchema = z.object({
  edge_id: z.number().int(),
  status: roadStatusCode,
  depth_cm: z.number().nullable(),
  length_m: z.number().nonnegative().optional(),
});

export const scoreComponentEnum = z.enum([
  "isolated_population",
  "vulnerable_share",
  "no_health_facility",
  "isolation_duration",
  "access_difficulty",
]);

export const scoreItemSchema = z.object({
  component: scoreComponentEnum,
  raw: z.number(),
  value: z.number(),
  weight: z.number(),
});

export const runVillageSchema = z.object({
  village_id: z.string(),
  name: z.string(),
  district: z.string(),
  center: lngLat,
  status: villageStatusEnum,
  isolated_population: z.number().int().nonnegative(),
  flooded_population: z.number().int().nonnegative(),
  population: z.number().int().nonnegative(),
  children_under5: z.number().int().nonnegative(),
  elderly: z.number().int().nonnegative(),
  priority_score: z.number().min(0).max(1).nullable(),
  probability: z.number().min(0).max(1).nullable(),
  cutoff_hour: horizonEnum.nullable(),
  score_breakdown: z.array(scoreItemSchema).nullable().optional(),
});

export const forecastRowSchema = z.object({
  village_id: z.string(),
  horizon_hours: horizonEnum,
  probability: z.number().min(0).max(1),
  cutoff_hour: horizonEnum.nullable(),
});

export const boatPointSchema = z.object({
  lon: z.number(),
  lat: z.number(),
  water_distance_m: z.number(),
});

export const routeSchema = z.object({
  mode: z.enum(["land", "boat"]),
  hub_id: z.number().int(),
  hub_name: z.string(),
  distance_m: z.number(),
  minutes: z.number(),
  coordinates: z.array(lngLat),
  boat_point: boatPointSchema.nullable(),
  recommendation: z.string(),
});

export const evacuationSchema = z.object({
  rank: z.number().int().min(1).max(3),
  facility_id: z.number().int(),
  facility_name: z.string(),
  facility_type: z.string(),
  source: z.enum(["OSM", "BPBD"]),
  lon: z.number(),
  lat: z.number(),
  distance_m: z.number(),
  walk_minutes: z.number(),
  drive_minutes: z.number(),
  leave_before_hour: z.number().int().nullable(),
  route: z.array(lngLat),
});

export const villageRunSchema = z.object({
  status: villageStatusEnum,
  isolated_population: z.number().int().nonnegative(),
  flooded_population: z.number().int().nonnegative(),
  priority_score: z.number().nullable(),
  score_breakdown: z.array(scoreItemSchema).nullable(),
  travel_minutes_now: z.number().nullable(),
  route: routeSchema.nullable(),
  evacuations: z.array(evacuationSchema).nullable(),
});

export const villageFileSchema = z.object({
  village_id: z.string(),
  name: z.string(),
  district: z.string(),
  regency: z.string(),
  population: z.number().int().nonnegative(),
  children_under5: z.number().int().nonnegative(),
  elderly: z.number().int().nonnegative(),
  center: lngLat,
  geom: z.object({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(z.array(z.array(lngLat))),
  }),
  health_facilities: z.number().int().nonnegative(),
  schools: z.number().int().nonnegative(),
  hand_median_m: z.number(),
  travel_minutes_normal: z.number().nullable(),
  runs: z.record(z.string(), villageRunSchema),
});

export const simSummarySchema = z.object({
  affected_villages: z.number().int(),
  isolated_villages: z.number().int(),
  partially_isolated: z.number().int(),
  isolated_population: z.number().int(),
  cut_road_km: z.number(),
});

export const sourceEnum = z.enum(["fastapi", "cache", "fallback"]);

export const simulationSchema = z.object({
  water_level_m: z.number(),
  vehicle: vehicleEnum,
  source: sourceEnum,
  summary: simSummarySchema,
  roads: z.array(roadStatusSchema),
  villages: z.array(
    z.object({
      village_id: z.string(),
      status: villageStatusEnum,
      isolated_population: z.number().int(),
      priority_score: z.number().nullable(),
      score_breakdown: z.array(scoreItemSchema).nullable().optional(),
    }),
  ),
});

export const simLevelSchema = simSummarySchema.extend({
  water_level_m: z.number(),
  vehicle: vehicleEnum,
});

export const simRoutesSchema = z.object({
  village_id: z.string(),
  levels: z.array(
    z.object({ water_level_m: z.number(), vehicle: vehicleEnum, route: routeSchema.nullable() }),
  ),
});

export const floodIndexSchema = z.object({
  bounds: z.tuple([lngLat, lngLat, lngLat, lngLat]),
  dates: z.array(
    z.object({
      date: z.string(),
      run_id: z.string(),
      acquired_at: z.string(),
      water_level_m: z.number(),
      area_km2: z.object({ shallow: z.number(), medium: z.number(), deep: z.number() }),
    }),
  ),
});

export const metricSchema = z.object({
  model: z.string().min(1),
  name: z.string().min(1),
  value: z.number(),
  note: z.string().nullable().optional(),
});

export const replayEvalSchema = z.object({
  village_id: z.string(),
  predicted: z.boolean(),
  observed: z.boolean(),
  category: z.enum(["tp", "fp", "fn", "tn"]),
});

export const nationalFloodsSchema = z.object({
  year: z.number().int(),
  total_floods: z.number().int(),
  total_disasters: z.number().int(),
  source: z.string(),
  provinces: z.array(z.object({ pcode: z.string(), name: z.string(), floods: z.number().int() })),
});

export const activeRegionSchema = z.object({
  region_id: z.string(),
  name: z.string(),
  province: z.string(),
  province_pcode: z.string(),
  bbox,
  center: lngLat,
  villages: z.number().int(),
  road_km: z.number(),
  population: z.number().int(),
});

const pointGeometry = z.object({ type: z.literal("Point"), coordinates: lngLat });

export const evacuationSitesSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(
    z.object({
      type: z.literal("Feature"),
      geometry: pointGeometry,
      properties: z.object({
        facility_id: z.number().int(),
        name: z.string(),
        type: z.string(),
        source: z.string(),
        hand_m: z.number().nullable(),
      }),
    }),
  ),
});

export const hubsSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(
    z.object({
      type: z.literal("Feature"),
      geometry: pointGeometry,
      properties: z.object({ hub_id: z.number().int(), name: z.string() }),
    }),
  ),
});

export const featureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(
    z.object({
      type: z.literal("Feature"),
      geometry: z.object({ type: z.string(), coordinates: z.unknown() }),
      properties: z.record(z.string(), z.unknown()).nullable(),
    }),
  ),
});

export const photoCreditSchema = z.object({
  id: z.string(),
  file: z.string(),
  title: z.string(),
  author: z.string(),
  license: z.string(),
  license_url: z.string().nullable().optional(),
  source_url: z.string(),
  place: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
});
