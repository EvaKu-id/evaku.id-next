import "server-only";
import { villageDetailsSchema, type VillageDetails } from "../schemas/village";
import { supabaseAdmin } from "./db";

export class VillageNotFoundError extends Error {
  constructor(villageId: string) {
    super(`Desa dengan id ${villageId} tidak ditemukan`);
    this.name = "VillageNotFoundError";
  }
}

export class VillageRunDataNotFoundError extends Error {
  constructor(villageId: string, runId: string) {
    super(`Data desa ${villageId} untuk run ${runId} tidak ditemukan`);
    this.name = "VillageRunDataNotFoundError";
  }
}

function getFacilityName(facility: unknown): string | null {
  const row = Array.isArray(facility) ? facility[0] : facility;
  if (typeof row !== "object" || row === null || !("name" in row)) {
    return null;
  }

  return typeof row.name === "string" ? row.name : null;
}

export async function getVillagesDetail(
  villageId: string,
  runId: string,
): Promise<VillageDetails> {
  const { data: village, error: villageError } = await supabaseAdmin.rpc("village_detail", {
    p_village_id: villageId,
  });

  if (villageError) {
    throw new Error(`RPC Error: ${villageError.message}`);
  }

  if (!village) {
    throw new VillageNotFoundError(villageId);
  }

  const [statusResult, evacuationsResult] = await Promise.all([
    supabaseAdmin
      .from("village_status")
      .select(
        "status, isolated_population, flooded_population, priority_score, score_breakdown, route, boat_point",
      )
      .eq("run_id", runId)
      .eq("village_id", villageId)
      .maybeSingle(),
    supabaseAdmin
      .from("village_evacuations")
      .select(
        "rank, facility_id, distance_m, walk_minutes, drive_minutes, leave_before_hour, route, facility:facilities(name)",
      )
      .eq("run_id", runId)
      .eq("village_id", villageId)
      .order("rank", { ascending: true }),
  ]);

  if (statusResult.error) {
    throw new Error(`Village status query error: ${statusResult.error.message}`);
  }
  if (evacuationsResult.error) {
    throw new Error(`Village evacuations query error: ${evacuationsResult.error.message}`);
  }
  if (!statusResult.data) {
    throw new VillageRunDataNotFoundError(villageId, runId);
  }

  const evacuations = evacuationsResult.data.length === 3
    ? evacuationsResult.data.map(({ facility, ...evacuation }) => ({
        ...evacuation,
        facility_name: getFacilityName(facility),
      }))
    : null;

  return villageDetailsSchema.parse({
    ...village,
    ...statusResult.data,
    evacuations,
  });
}
