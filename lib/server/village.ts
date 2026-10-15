import "server-only";
import type { VillageDetails } from "../schemas/village";
import { supabaseAdmin } from "./db";

export class VillageNotFoundError extends Error {
  constructor(villageId: string) {
    super(`Desa dengan id ${villageId} tidak ditemukan`);
    this.name = "VillageNotFoundError";
  }
}
export async function getVillagesDetail(
  villageId: string,
  runId?: string,
): Promise<VillageDetails> {
 const { data, error } = await supabaseAdmin.rpc("village_detail", {

   p_village_id: villageId,
  });

 if (error) {
    throw new Error(`RPC Error: ${error.message}`);

   if (!data) {
    throw new VillageNotFoundError(villageId);
  }
}

 if (runId) {

 }

 return data;
}
