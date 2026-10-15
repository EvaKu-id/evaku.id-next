import z from "zod";
import { responseSourceSchema } from "./common";

export const routeResponseSchema = z.object({
  source: responseSourceSchema,
}).passthrough();

export type RouteResponse = z.infer<typeof routeResponseSchema>;
