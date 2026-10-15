import { z } from "zod";

const isoDateTime = z.iso.datetime();

export const publicLatestResponse = z.object({
  radar: z.object({
    run_id: z.string(),
    data_time: isoDateTime,
  }).nullable(),
  forecasts: z.array(z.object({
    run_id: z.string(),
    data_time: isoDateTime,
    horizon_hours: z.union([z.literal(24), z.literal(48), z.literal(72)]),
  })),
});

export const publicRoadsResponse = z.array(z.object({
  edge_id: z.number().int(),
  status: z.number().int().min(0).max(3),
  depth_cm: z.number().nonnegative().nullable(),
}));

export const publicVillagesResponse = z.array(z.object({
  village_id: z.string(),
  name: z.string(),
  status: z.enum(["reachable", "partially_isolated", "fully_isolated"]),
  isolated_population: z.number().int().nonnegative(),
  flooded_population: z.number().int().nonnegative(),
  priority_score: z.number().min(0).max(1).nullable(),
}));

export const publicErrorResponse = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type PublicLatestResponse = z.infer<typeof publicLatestResponse>;
export type PublicRoadsResponse = z.infer<typeof publicRoadsResponse>;
export type PublicVillagesResponse = z.infer<typeof publicVillagesResponse>;

type JsonResponse<T> = {
  content: {
    "application/json": T;
  };
};

type PublicGetOperation<T, Parameters = never> = {
  parameters: Parameters extends never
    ? { query?: never; header?: never; path?: never; cookie?: never }
    : { path: Parameters };
  responses: {
    200: JsonResponse<T>;
    500: JsonResponse<z.infer<typeof publicErrorResponse>>;
  };
};

export interface paths {
  "/api/latest": {
    get: PublicGetOperation<PublicLatestResponse>;
  };
  "/api/runs/{id}/roads": {
    get: PublicGetOperation<PublicRoadsResponse, { id: string }>;
  };
  "/api/runs/{id}/villages": {
    get: PublicGetOperation<PublicVillagesResponse, { id: string }>;
  };
}