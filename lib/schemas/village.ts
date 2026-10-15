import z from "zod";

const MultiPolygonCoordinatesSchema = z.array(
  z.array(z.array(z.array(z.number()).length(2))),
);

export const villageStatusSchema = z.object({
  village_id: z.string(),
  name: z.string(),
  status: z.enum(["reachable", "partially_isolated", "fully_isolated"]),
  isolated_population: z.number().int().nonnegative(),
  flooded_population: z.number().int().nonnegative(),
  priority_score: z.number().nullable(),
});

export const villageStatusListSchema = z.array(villageStatusSchema);

export const villageEvacuationSchema = z.object({
  rank: z.number().int().min(1).max(3),
  facility_id: z.number().int(),
  facility_name: z.string().nullable(),
  distance_m: z.number().nonnegative().nullable(),
  walk_minutes: z.number().nonnegative().nullable(),
  drive_minutes: z.number().nonnegative().nullable(),
  leave_before_hour: z.number().int().nonnegative().nullable(),
  route: z.object({}).passthrough().nullable(),
});

export const villageEvacuationListSchema = z
  .array(villageEvacuationSchema)
  .length(3);

export const villageDetailsSchema = villageStatusSchema.extend({
  district: z.string(),
  regency: z.string(),
  population: z.number().int().nonnegative().nullable(),
  children_under5: z.number().int().nonnegative().nullable(),
  elderly: z.number().int().nonnegative().nullable(),
  geom: MultiPolygonCoordinatesSchema,
  score_breakdown: z.object({}).passthrough().nullable(),
  route: z.object({}).passthrough().nullable(),
  boat_point: z.object({}).passthrough().nullable(),
  evacuations: villageEvacuationListSchema,
});

export const villageForecastSchema = z.object({
  village_id: z.string(),
  horizon_hours: z.number().int().positive(),
  probability: z.number().min(0).max(1),
  cutoff_hour: z.number().int().nonnegative().nullable(),
});

export const villageForecastListSchema = z.array(villageForecastSchema);

export type VillageStatus = z.infer<typeof villageStatusSchema>;
export type VillageEvacuation = z.infer<typeof villageEvacuationSchema>;
export type VillageDetails = z.infer<typeof villageDetailsSchema>;
export type villageDetails = VillageDetails;
export type VillageForecast = z.infer<typeof villageForecastSchema>;
