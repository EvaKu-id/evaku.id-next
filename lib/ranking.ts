import { rescore, type ScoreWeights } from "@/lib/scoring";
import type { RunVillage } from "@/types/data";

export interface RankedVillage extends RunVillage {
  rank: number;
  score: number;
}

// Applies the operator's weights; villages still reachable are not ranked.
export function rankByPriority(villages: readonly RunVillage[], weights: ScoreWeights, district: string | null): RankedVillage[] {
  return villages
    .filter((village) => village.status !== "reachable")
    .filter((village) => district === null || village.district === district)
    .map((village) => ({
      ...village,
      score: village.score_breakdown ? rescore(village.score_breakdown, weights) : (village.priority_score ?? 0),
    }))
    .sort((a, b) => b.score - a.score || b.isolated_population - a.isolated_population)
    .map((village, index) => ({ ...village, rank: index + 1 }));
}

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function rankingCsv(rows: readonly RankedVillage[]): string {
  const header = ["peringkat", "kode_desa", "desa", "kecamatan", "status", "warga_terisolasi", "balita", "lansia", "jam_putus", "skor"];
  const lines = rows.map((row) =>
    [row.rank, row.village_id, row.name, row.district, row.status, row.isolated_population, row.children_under5, row.elderly, row.cutoff_hour, row.score.toFixed(3)]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
