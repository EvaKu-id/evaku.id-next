import { http, HttpResponse, delay } from "msw";

import komandoList from "./fixtures/komando/analisis.200.json";
import analisis200 from "./fixtures/komando/analisis.200.json";
import analisis422 from "./fixtures/komando/analisis.422.json";
import buktiList from "./fixtures/bukti/list.200.json";

export const handlers = [
  http.get("*/api/komando", () => HttpResponse.json(komandoList)),

  http.post("*/api/komando/analisis", async ({ request }) => {
    await delay(1500);
    const body = (await request.json()) as { teks?: string };
    if (!body?.teks) return HttpResponse.json(analisis422, { status: 422 });
    return HttpResponse.json(analisis200);
  }),

  http.get("*/api/bukti", () => HttpResponse.json(buktiList)),
];