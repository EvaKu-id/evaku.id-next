import z from "zod";
import { responseSourceSchema } from "./common";

// Field payload model menunggu contracts/openapi.json; jangan dibuang saat parsing.
export const simulationResponseSchema = z.object({
  source: responseSourceSchema,
}).passthrough();

export const recalcResponseSchema = simulationResponseSchema;

export type SimulationResponse = z.infer<typeof simulationResponseSchema>;
export type RecalcResponse = z.infer<typeof recalcResponseSchema>;
