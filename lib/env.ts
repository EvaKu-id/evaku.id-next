import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

// Parsed on first use, not at import, so `next build` can collect routes without server secrets.
export function serverEnv(): ServerEnv {
  cached ??= envSchema.parse(process.env);
  return cached;
}
