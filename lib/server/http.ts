import { NextResponse } from "next/server";
import type { ApiError } from "../schemas/common";

export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

// Format error seragam untuk semua route: { error: { code, message } }.
export function apiError(code: string, message: string, status: number) {
  const body: ApiError = { error: { code, message } };
  return NextResponse.json(body, { status });
}
