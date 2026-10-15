import z from "zod";
import { responseSourceSchema } from "./common";

// Field payload model menunggu contracts/openapi.json; jangan dibuang saat parsing.
export const routeResponseSchema = z.object({
  source: responseSourceSchema,
}).passthrough();

export type RouteResponse = z.infer<typeof routeResponseSchema>;
