import { describe, expect, it } from "bun:test";
import { apiErrorSchema } from "@/lib/schemas/common";
import { roadStatusListSchema, roadStatusSchema } from "@/lib/schemas/roads";
import { routeResponseSchema } from "@/lib/schemas/route";
import { latestRunsSchema } from "@/lib/schemas/runs";
import {
  recalcResponseSchema,
  simulationResponseSchema,
} from "@/lib/schemas/simulation";
import {
  villageDetailsSchema,
  villageEvacuationListSchema,
  villageForecastListSchema,
  villageForecastSchema,
  villageStatusListSchema,
  villageStatusSchema,
} from "@/lib/schemas/village";

const villageStatus = {
  village_id: "village-1",
  name: "Desa Contoh",
  status: "reachable" as const,
  isolated_population: 0,
  flooded_population: 10,
  priority_score: 0.5,
};

const route = {
  type: "LineString",
  coordinates: [
    [110, -7],
    [110.01, -7.01],
  ],
};

const evacuations = [1, 2, 3].map((rank) => ({
  rank,
  facility_id: rank,
  facility_name: `Fasilitas ${rank}`,
  distance_m: 100 * rank,
  walk_minutes: 5 * rank,
  drive_minutes: 2 * rank,
  leave_before_hour: 24,
  route,
}));

const villageDetails = {
  village_id: villageStatus.village_id,
  name: villageStatus.name,
  district: "Kecamatan Contoh",
  regency: "Kabupaten Contoh",
  population: 100,
  children_under5: 10,
  elderly: 20,
  geom: [
    [
      [
        [110, -7],
        [111, -7],
        [111, -8],
        [110, -7],
      ],
    ],
  ],
  score_breakdown: { population: { score: 0.5, weight: 0.2 } },
  route,
  boat_point: null,
  evacuations,
};

const forecast = {
  village_id: villageStatus.village_id,
  horizon_hours: 24,
  probability: 0.75,
  cutoff_hour: 48,
};

const latestRun = {
  run_id: "radar-1",
  data_time: "2026-10-14T12:00:00Z",
};

describe("response status desa", () => {
  it("memvalidasi item dan larik status tanpa envelope tambahan", () => {
    expect(villageStatusSchema.parse(villageStatus)).toEqual(villageStatus);
    expect(villageStatusListSchema.parse([villageStatus])).toEqual([
      villageStatus,
    ]);
    expect(villageStatusListSchema.parse([])).toEqual([]);
  });

  it("menerima priority_score null sesuai SQL", () => {
    expect(
      villageStatusSchema.safeParse({
        ...villageStatus,
        priority_score: null,
      }).success,
    ).toBe(true);
  });

  it("menolak status asing serta jumlah penduduk negatif atau pecahan", () => {
    for (const patch of [
      { status: "unknown" },
      { isolated_population: -1 },
      { flooded_population: 0.5 },
      { priority_score: undefined },
    ]) {
      expect(
        villageStatusSchema.safeParse({ ...villageStatus, ...patch }).success,
      ).toBe(false);
    }
  });
});

describe("response detail desa", () => {
  it("memuat elderly, rincian skor, rute, dan tiga evakuasi bernama fasilitas", () => {
    expect(villageDetailsSchema.parse(villageDetails)).toEqual(villageDetails);
  });

  it("menerima kolom nullable dari desa", () => {
    const details = {
      ...villageDetails,
      population: null,
      children_under5: null,
      elderly: null,
      score_breakdown: null,
      route: null,
      boat_point: null,
    };
    expect(villageDetailsSchema.parse(details)).toEqual(details);
  });

  it("mempertahankan payload boat_point yang belum dirinci kontraknya", () => {
    const details = {
      ...villageDetails,
      boat_point: { coordinates: [110, -7] },
    };
    expect(villageDetailsSchema.parse(details)).toEqual(details);
  });

  it("menerima nama fasilitas dan hasil evakuasi nullable sesuai SQL", () => {
    const rows = evacuations.map((row) => ({
      ...row,
      facility_name: null,
      distance_m: null,
      walk_minutes: null,
      drive_minutes: null,
      leave_before_hour: null,
      route: null,
    }));
    expect(villageEvacuationListSchema.parse(rows)).toEqual(rows);
  });

  it("mewajibkan tepat tiga baris evakuasi dengan rank 1–3", () => {
    for (const rows of [
      [],
      evacuations.slice(0, 2),
      [...evacuations, evacuations[0]],
    ]) {
      expect(
        villageDetailsSchema.safeParse({ ...villageDetails, evacuations: rows })
          .success,
      ).toBe(false);
    }
    expect(
      villageEvacuationListSchema.safeParse([
        { ...evacuations[0], rank: 0 },
        evacuations[1],
        evacuations[2],
      ]).success,
    ).toBe(false);
  });

  it("menolak detail tanpa elderly, nama fasilitas, atau evakuasi", () => {
    for (const field of ["elderly", "evacuations"]) {
      expect(
        villageDetailsSchema.safeParse({
          ...villageDetails,
          [field]: undefined,
        }).success,
      ).toBe(false);
    }
    expect(
      villageEvacuationListSchema.safeParse([
        { ...evacuations[0], facility_name: undefined },
        evacuations[1],
        evacuations[2],
      ]).success,
    ).toBe(false);
  });

  it("menolak koordinat yang bukan pasangan angka", () => {
    expect(
      villageDetailsSchema.safeParse({
        ...villageDetails,
        geom: [[[[110, -7, 10]]]],
      }).success,
    ).toBe(false);
  });
});

describe("response prakiraan desa", () => {
  it("memvalidasi item, larik kosong, dan cutoff_hour null", () => {
    expect(villageForecastSchema.parse(forecast)).toEqual(forecast);
    expect(villageForecastListSchema.parse([forecast])).toEqual([forecast]);
    expect(villageForecastListSchema.parse([])).toEqual([]);
    expect(
      villageForecastSchema.safeParse({ ...forecast, cutoff_hour: null })
        .success,
    ).toBe(true);
  });

  it("menerima batas probabilitas 0 dan 1", () => {
    for (const probability of [0, 1]) {
      expect(
        villageForecastSchema.safeParse({ ...forecast, probability }).success,
      ).toBe(true);
    }
  });

  it("menolak probabilitas di luar 0–1 dan horizon tidak valid", () => {
    for (const patch of [
      { probability: -0.1 },
      { probability: 1.1 },
      { horizon_hours: 0 },
      { horizon_hours: 1.5 },
      { cutoff_hour: -1 },
    ]) {
      expect(
        villageForecastSchema.safeParse({ ...forecast, ...patch }).success,
      ).toBe(false);
    }
  });
});

describe("response status jalan", () => {
  it("memvalidasi larik status numerik per edge_id dan kedalaman nullable", () => {
    const roads = [0, 1, 2, 3].map((status) => ({
      edge_id: status + 1,
      status,
      depth_cm: status === 3 ? null : 10 * status,
    }));
    expect(roadStatusListSchema.parse(roads)).toEqual(roads);
    expect(roadStatusListSchema.parse([])).toEqual([]);
  });

  it("menolak kode di luar kontrak, enum koreksi jalan, dan kedalaman negatif", () => {
    for (const patch of [
      { status: -1 },
      { status: 4 },
      { status: "aman" },
      { edge_id: 1.5 },
      { depth_cm: -1 },
      { depth_cm: 0.5 },
    ]) {
      expect(
        roadStatusSchema.safeParse({
          edge_id: 1,
          status: 0,
          depth_cm: 0,
          ...patch,
        }).success,
      ).toBe(false);
    }
  });
});

describe("response run terbaru", () => {
  it("memuat radar dan prakiraan per horizon beserta data_time", () => {
    const latest = {
      radar: latestRun,
      forecasts: [24, 48, 72].map((horizon_hours) => ({
        ...latestRun,
        run_id: `forecast-${horizon_hours}`,
        horizon_hours,
      })),
    };
    expect(latestRunsSchema.parse(latest)).toEqual(latest);
  });

  it("menerima belum adanya run dan timestamp dengan offset zona waktu", () => {
    expect(latestRunsSchema.parse({ radar: null, forecasts: [] })).toEqual({
      radar: null,
      forecasts: [],
    });
    expect(
      latestRunsSchema.safeParse({
        radar: { ...latestRun, data_time: "2026-10-14T19:00:00+07:00" },
        forecasts: [],
      }).success,
    ).toBe(true);
  });

  it("menolak timestamp tidak valid dan prakiraan tanpa horizon", () => {
    expect(
      latestRunsSchema.safeParse({
        radar: { ...latestRun, data_time: "kemarin" },
        forecasts: [],
      }).success,
    ).toBe(false);
    expect(
      latestRunsSchema.safeParse({ radar: null, forecasts: [latestRun] })
        .success,
    ).toBe(false);
  });
});

for (const [name, schema] of [
  ["simulasi", simulationResponseSchema],
  ["rute", routeResponseSchema],
  ["recalc", recalcResponseSchema],
] as const) {
  describe(`response ${name}`, () => {
    it("memvalidasi ketiga source dan mempertahankan payload model", () => {
      for (const source of ["fastapi", "cache", "fallback"] as const) {
        const result = { source, result: { villages: [villageStatus], route } };
        expect(schema.parse(result)).toEqual(result);
      }
    });

    it("menolak source hilang atau tidak dikenal", () => {
      expect(schema.safeParse({}).success).toBe(false);
      expect(schema.safeParse({ source: "model" }).success).toBe(false);
    });
  });
}

describe("response error API", () => {
  it("memakai format error.code dan error.message yang seragam", () => {
    const error = {
      error: { code: "BAD_REQUEST", message: "Input tidak valid" },
    };
    expect(apiErrorSchema.parse(error)).toEqual(error);
  });

  it("menolak format error lama dan message yang hilang", () => {
    expect(
      apiErrorSchema.safeParse({
        kode: "BAD_REQUEST",
        pesan: "Input tidak valid",
      }).success,
    ).toBe(false);
    expect(
      apiErrorSchema.safeParse({ error: { code: "BAD_REQUEST" } }).success,
    ).toBe(false);
  });
});
