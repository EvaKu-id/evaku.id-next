import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { apiError, IMMUTABLE_CACHE_CONTROL } from "@/lib/server/http";
import { getVillagesDetail, VillageNotFoundError } from "@/lib/server/village";

const paramsSchema = z.object({ id: z.string().min(1) });
const querySchema = z.object({ run: z.string().min(1) });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = paramsSchema.safeParse(await params);
    if (!parsedParams.success) {
      return apiError("BAD_REQUEST", "ID desa wajib diisi", 400);
    }

    const parsedQuery = querySchema.safeParse({
      run: req.nextUrl.searchParams.get("run") ?? undefined,
    });
    if (!parsedQuery.success) {
      return apiError("BAD_REQUEST", "Query parameter run wajib diisi", 400);
    }

    const detail = await getVillagesDetail(
      parsedParams.data.id,
      parsedQuery.data.run,
    );

    return NextResponse.json(detail, {
      status: 200,
      headers: { "Cache-Control": IMMUTABLE_CACHE_CONTROL },
    });
  } catch (error) {
    if (error instanceof VillageNotFoundError) {
      return apiError("NOT_FOUND", error.message, 404);
    }

    console.error("GET /api/villages/[id] gagal", error);
    return apiError("INTERNAL_SERVER_ERROR", "Terjadi kesalahan sistem", 500);
  }
}
