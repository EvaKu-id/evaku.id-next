import { describe, expect, test } from "bun:test";
import { clampLevel, levelKey, routeLevel } from "@/lib/data/paths";
import { probabilityClass, cutoffLabel } from "@/lib/forecast";
import { formatWib, formatMinutes } from "@/lib/format";
import { classIndex, quantileBreaks } from "@/lib/national-style";
import { rankByPriority, rankingCsv } from "@/lib/ranking";
import { summarize } from "@/lib/run-summary";
import { DEFAULT_WEIGHTS, rescore, weightsTotal } from "@/lib/scoring";
import { DEFAULT_THRESHOLDS, statusFromDepth } from "@/lib/thresholds";
import type { RunVillage, ScoreItem } from "@/types/data";

function village(overrides: Partial<RunVillage>): RunVillage {
  return {
    village_id: "1",
    name: "Desa",
    district: "Kec",
    center: [98, 4],
    status: "reachable",
    isolated_population: 0,
    flooded_population: 0,
    population: 100,
    children_under5: 10,
    elderly: 5,
    priority_score: null,
    probability: null,
    cutoff_hour: null,
    ...overrides,
  };
}

describe("probability classes", () => {
  test("uses the calibrated thresholds", () => {
    expect(probabilityClass(0.34)).toBe("low");
    expect(probabilityClass(0.35)).toBe("mid");
    expect(probabilityClass(0.69)).toBe("mid");
    expect(probabilityClass(0.7)).toBe("high");
  });

  test("labels the cut-off hour", () => {
    expect(cutoffLabel(null)).toBe("Tidak diperkirakan putus");
    expect(cutoffLabel(48)).toBe("Putus dalam ±48 jam");
  });
});

describe("road status by vehicle", () => {
  const road = (depth_cm: number | null, status: 0 | 1 | 2 | 3 = 1) => ({ edge_id: 1, status, depth_cm });

  test("water up to the car limit is safe", () => {
    expect(statusFromDepth(road(30), "car", DEFAULT_THRESHOLDS).status).toBe(0);
  });

  test("between limits: cut for cars, limited for trucks", () => {
    expect(statusFromDepth(road(45), "car", DEFAULT_THRESHOLDS).status).toBe(2);
    expect(statusFromDepth(road(45), "truck", DEFAULT_THRESHOLDS).status).toBe(1);
  });

  test("above the truck limit is cut for both", () => {
    expect(statusFromDepth(road(61), "truck", DEFAULT_THRESHOLDS).status).toBe(2);
  });

  test("unknown depth keeps its status", () => {
    expect(statusFromDepth(road(null, 3), "car", DEFAULT_THRESHOLDS).status).toBe(3);
  });

  test("custom thresholds apply", () => {
    expect(statusFromDepth(road(45), "car", { car_cm: 50, truck_cm: 80 }).status).toBe(0);
  });
});

describe("priority scoring", () => {
  const items: ScoreItem[] = [
    { component: "isolated_population", raw: 100, value: 1, weight: 0.35 },
    { component: "vulnerable_share", raw: 0.2, value: 0, weight: 0.2 },
    { component: "no_health_facility", raw: 1, value: 1, weight: 0.2 },
    { component: "isolation_duration", raw: 72, value: 0.5, weight: 0.15 },
    { component: "access_difficulty", raw: 3, value: 0, weight: 0.1 },
  ];

  test("default weights sum to one", () => {
    expect(weightsTotal(DEFAULT_WEIGHTS)).toBeCloseTo(1);
  });

  test("rescore uses the given weights", () => {
    expect(rescore(items, DEFAULT_WEIGHTS)).toBeCloseTo(0.35 + 0.2 + 0.075);
    expect(rescore(items, { ...DEFAULT_WEIGHTS, isolated_population: 0, vulnerable_share: 0.55 })).toBeCloseTo(0.275);
  });

  test("components without data share their weight", () => {
    const partial = items.map((item) => (item.component === "isolation_duration" ? { ...item, weight: 0 } : item));
    expect(rescore(partial, DEFAULT_WEIGHTS)).toBeCloseTo((0.35 + 0.2) / 0.85);
  });

  test("ranking skips reachable villages and filters by district", () => {
    const ranked = rankByPriority(
      [
        village({ village_id: "a", status: "fully_isolated", priority_score: 0.2, district: "X" }),
        village({ village_id: "b", status: "partially_isolated", priority_score: 0.9, district: "Y" }),
        village({ village_id: "c", status: "reachable", priority_score: 1 }),
      ],
      DEFAULT_WEIGHTS,
      null,
    );
    expect(ranked.map((v) => v.village_id)).toEqual(["b", "a"]);
    expect(ranked[0].rank).toBe(1);
    expect(rankByPriority(ranked, DEFAULT_WEIGHTS, "X").map((v) => v.village_id)).toEqual(["a"]);
  });

  test("CSV escapes commas", () => {
    const csv = rankingCsv(rankByPriority([village({ name: "Desa, Satu", status: "fully_isolated" })], DEFAULT_WEIGHTS, null));
    expect(csv.split("\n")[1]).toContain('"Desa, Satu"');
  });
});

describe("summaries", () => {
  test("counts isolated villages and cut kilometres", () => {
    const result = summarize(
      [village({ status: "fully_isolated", isolated_population: 50 }), village({ status: "partially_isolated", isolated_population: 20 })],
      [
        { edge_id: 1, status: 2, depth_cm: 80, length_m: 1500 },
        { edge_id: 2, status: 1, depth_cm: 40, length_m: 500 },
      ],
    );
    expect(result.isolatedVillages).toBe(1);
    expect(result.partialVillages).toBe(1);
    expect(result.isolatedPopulation).toBe(70);
    expect(result.cutRoadKm).toBeCloseTo(1.5);
    expect(result.limitedRoadKm).toBeCloseTo(0.5);
  });
});

describe("simulation levels", () => {
  test("snaps to 10 cm and clamps to 0–5 m", () => {
    expect(clampLevel(1.04)).toBe(1);
    expect(clampLevel(7)).toBe(5);
    expect(levelKey(1.5)).toBe("150");
    expect(levelKey(0)).toBe("000");
  });

  test("routes use the half metre at or below the level", () => {
    expect(routeLevel(1.4)).toBe(1);
    expect(routeLevel(1.5)).toBe(1.5);
    expect(routeLevel(0.2)).toBe(0.5);
  });
});

describe("formatting", () => {
  test("shows WIB", () => {
    expect(formatWib("2026-10-10T00:00:00Z")).toContain("07:00 WIB");
  });

  test("minutes", () => {
    expect(formatMinutes(45)).toBe("45 mnt");
    expect(formatMinutes(90)).toBe("1 jam 30 mnt");
  });
});

describe("national classes", () => {
  test("quantile breaks increase", () => {
    const breaks = quantileBreaks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect([...breaks].sort((a, b) => a - b)).toEqual(breaks);
    expect(classIndex(1, breaks)).toBe(0);
    expect(classIndex(10, breaks)).toBe(4);
  });
});
