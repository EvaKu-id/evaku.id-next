import { describe, it, expect } from "bun:test";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import * as S from "@/contracts/schema"; 

const ROOT = "mocks/fixtures";
// tar di pasin be
const buktiListResponse = z.record(z.string(), z.unknown());
const cases: Record<string, z.ZodType> = {
  "run/latest.200.json": S.latestRunResponse,
  "ruas/status.200.json": S.ruasStatusResponse,
  "ruas/status.kosong.200.json": S.ruasStatusResponse,
  "desa/list.200.json": S.desaListResponse,
  "desa/list.kosong.200.json": S.desaListResponse,
  "desa/detail.200.json": S.desaDetailResponse,
  "desa/detail.terisolasi.200.json": S.desaDetailResponse,
  "banjir/peluang.200.json": S.peluangBanjirResponse,
  "simulasi/hasil.200.json": S.simulasiResponse,
  "simulasi/hasil.cadangan.200.json": S.simulasiResponse,
  "rute/rute.200.json": S.ruteResponse,
  "rute/rute.terisolasi.200.json": S.ruteResponse,
  "metrik/metrik.200.json": S.metrikResponse,
  "run/latest.cadangan.200.json": S.latestRunResponse,
  "banjir/peluang.kosong.200.json": S.peluangBanjirResponse,
  "_error/500.json": S.errorResponse,
  "komando/list.200.json": S.komandoListResponse,
  "komando/list.kosong.200.json": S.komandoListResponse,
  "komando/analisis.200.json": S.analisisResponse,
  "komando/analisis.422.json": S.errorResponse,
  "bukti/list.200.json": buktiListResponse,
  "bukti/list.kosong.200.json": buktiListResponse,
};

const read = (f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));

describe("fixture lolos skema zod BE", () => {
  for (const [file, schema] of Object.entries(cases)) {
    it(file, () => {
      const r = schema.safeParse(read(file));
      expect(r.success, r.success ? "" : z.prettifyError(r.error)).toBe(true);
    });
  }

  it("setiap fixture terdaftar di tes (tidak ada yang lolos tanpa dicek)", () => {
    const all = (function walk(d: string): string[] {
      return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(d, e.name)) : [path.relative(ROOT, path.join(d, e.name)).replaceAll("\\", "/")]);
    })(ROOT);
    expect(all.filter((f) => !(f in cases))).toEqual([]);
  });
});

describe("kasus khusus", () => {
  it("detail desa punya tepat 3 titik evakuasi", () => {
    expect(read("desa/detail.200.json").titik_evakuasi).toHaveLength(3);
  });
  it("desa terisolasi: tanpa akses darat dan ada titik perahu", () => {
    const d = read("desa/detail.terisolasi.200.json");
    expect(d.terisolasi).toBe(true);
    expect(d.titik_evakuasi.some((t: any) => t.jenis === "titik_perahu")).toBe(true);
  });
  it("simulasi cadangan ditandai sumber cadangan", () => {
    expect(read("simulasi/hasil.cadangan.200.json").sumber).toBe("cadangan");
  });
  it("data kosong benar-benar kosong", () => {
    expect(read("desa/list.kosong.200.json").data).toEqual([]);
  });
});