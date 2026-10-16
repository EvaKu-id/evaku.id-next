import type { z } from "zod";

export class DataError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    readonly retryAfterS: number | null = null,
  ) {
    super(message);
    this.name = "DataError";
  }
}

interface FetchJsonOptions {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
}

function errorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error: unknown }).error;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }
  }
  return `Permintaan gagal (${status})`;
}

export async function fetchJson<T extends z.ZodType>(
  url: string,
  schema: T,
  { method = "GET", body, signal }: FetchJsonOptions = {},
): Promise<z.infer<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new DataError("Tidak bisa terhubung. Periksa koneksi lalu coba lagi.");
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    throw new DataError(
      errorMessage(payload, response.status),
      response.status,
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new DataError("Format data tidak dikenali.", response.status);
  return parsed.data;
}
