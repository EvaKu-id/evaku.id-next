import z from "zod";

export const responseSourceSchema = z.enum(["fastapi", "cache", "fallback"]);

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ResponseSource = z.infer<typeof responseSourceSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
