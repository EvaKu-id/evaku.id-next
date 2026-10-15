import z from "zod";

export const latestRunSchema = z.object({
  run_id: z.string(),
  data_time: z.iso.datetime({ offset: true }),
});

export const latestForecastRunSchema = latestRunSchema.extend({
  horizon_hours: z.number().int().positive(),
});

// Dokumen belum merinci bentuk agregasi: satu radar dan daftar forecast per horizon.
export const latestRunsSchema = z.object({
  radar: latestRunSchema.nullable(),
  forecasts: z.array(latestForecastRunSchema),
});

export type LatestRun = z.infer<typeof latestRunSchema>;
export type LatestForecastRun = z.infer<typeof latestForecastRunSchema>;
export type LatestRuns = z.infer<typeof latestRunsSchema>;
