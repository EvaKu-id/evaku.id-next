import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import { getSkenario, type Skenario } from "./scenario";


import errorBody from "./fixtures/_error/500.json";

import runNormal from "./fixtures/run/latest.200.json";
import runCadangan from "./fixtures/run/latest.cadangan.200.json";
import ruasNormal from "./fixtures/ruas/status.200.json";
import ruasKosong from "./fixtures/ruas/status.kosong.200.json";
import desaNormal from "./fixtures/desa/list.200.json";
import desaKosong from "./fixtures/desa/list.kosong.200.json";
import detailNormal from "./fixtures/desa/detail.200.json";
import detailTerisolasi from "./fixtures/desa/detail.terisolasi.200.json";
import peluangNormal from "./fixtures/banjir/peluang.200.json";
import peluangKosong from "./fixtures/banjir/peluang.kosong.200.json";
import simNormal from "./fixtures/simulasi/hasil.200.json";
import simCadangan from "./fixtures/simulasi/hasil.cadangan.200.json";
import ruteNormal from "./fixtures/rute/rute.200.json";
import ruteTerisolasi from "./fixtures/rute/rute.terisolasi.200.json";
import metrik from "./fixtures/metrik/metrik.200.json";
import komandoNormal from "./fixtures/komando/list.200.json";
import komandoKosong from "./fixtures/komando/list.kosong.200.json";
import buktiNormal from "./fixtures/bukti/list.200.json";
import buktiKosong from "./fixtures/bukti/list.kosong.200.json";
import analisis200 from "./fixtures/komando/analisis.200.json";
import analisis422 from "./fixtures/komando/analisis.422.json";

type Variants = { normal: unknown } & Partial<Record<Skenario, unknown>>;


const ms = (n: number) => (process.env.NODE_ENV === "test" ? 0 : n);

// Aturan: "error" → 500 untuk semua endpoint. Skenario lain memakai varian
// yang tersedia, dan kalau endpoint tidak punya varian itu, jatuh ke "normal".
function serve(method: "get" | "post", path: string, v: Variants, delayMs = 300) {
  return http[method](path, async () => {
    await delay(ms(delayMs));
    const s = getSkenario();
    if ((s as string) === "error") return HttpResponse.json(errorBody, { status: 500 });
    return HttpResponse.json((v[s] ?? v.normal) as Record<string, unknown>);
  });
}

export const handlers = [
  serve("get", "*/api/run/latest",     { normal: runNormal, cadangan: runCadangan }),
  serve("get", "*/api/ruas/status",    { normal: ruasNormal, kosong: ruasKosong }),
  serve("get", "*/api/desa",           { normal: desaNormal, kosong: desaKosong }),
  serve("get", "*/api/desa/:id",       { normal: detailNormal, terisolasi: detailTerisolasi }),
  serve("get", "*/api/banjir/peluang", { normal: peluangNormal, kosong: peluangKosong }),
  serve("post", "*/api/simulasi",      { normal: simNormal, cadangan: simCadangan }, 1500), // AI/ML lambat
  serve("get", "*/api/rute",           { normal: ruteNormal, terisolasi: ruteTerisolasi }),
  serve("get", "*/api/metrik",         { normal: metrik }),
  serve("get", "*/api/komando",        { normal: komandoNormal, kosong: komandoKosong }),
  serve("get", "*/api/bukti",          { normal: buktiNormal, kosong: buktiKosong }),

  // analisis ai/ml
  http.post("*/api/komando/analisis", async ({ request }) => {
    await delay(ms(1500));
    if ((getSkenario() as string) === "error") return HttpResponse.json(errorBody, { status: 500 });
    const body = (await request.json().catch(() => null)) as { teks?: string } | null;
    if (!body?.teks) return HttpResponse.json(analisis422, { status: 422 });
    return HttpResponse.json(analisis200);
  }),
];