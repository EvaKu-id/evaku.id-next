import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import { bundleSource } from "@/lib/data/bundle-source";
import { getSkenario } from "./scenario";
import publicErrorBody from "./fixtures/_error/public-500.json";

// Serves the API data source from the versioned data files, so `dev:mock` with
// NEXT_PUBLIC_DATA_SOURCE=api exercises every page with the same data as production files.
const BUNDLE_RUN = /^(fc|rd)-/;

function failIfError() {
  return getSkenario() === "error" ? HttpResponse.json(publicErrorBody, { status: 500 }) : null;
}

function json(load: () => Promise<unknown>, empty?: unknown[]) {
  return async () => {
    await delay(250);
    const failure = failIfError();
    if (failure) return failure;
    if (getSkenario() === "kosong" && empty !== undefined) return Response.json(empty);
    return Response.json(await load());
  };
}

export const bundleHandlers = [
  http.get("*/api/manifest", json(() => bundleSource.manifest())),
  http.get("*/api/forecasts", json(() => bundleSource.forecasts(), [])),
  http.get("*/api/metrics", json(() => bundleSource.metrics())),
  http.get("*/api/replay-eval", json(() => bundleSource.replayEval())),
  http.get("*/api/runs/:id/roads", ({ params }) => {
    const id = String(params.id);
    if (!BUNDLE_RUN.test(id)) return undefined;
    return json(() => bundleSource.roads(id), [])();
  }),
  http.get("*/api/runs/:id/villages", ({ params }) => {
    const id = String(params.id);
    if (!BUNDLE_RUN.test(id)) return undefined;
    return json(() => bundleSource.villages(id), [])();
  }),
  http.get("*/api/villages/:id", ({ params, request }) => {
    const run = new URL(request.url).searchParams.get("run");
    if (!run || !BUNDLE_RUN.test(run)) return undefined;
    return json(() => bundleSource.village(String(params.id), run))();
  }),
  http.post("*/api/simulation", async ({ request }) => {
    const body = (await request.json().catch(() => null)) as { water_level_m?: number; vehicle?: "car" | "truck" } | null;
    await delay(400);
    const failure = failIfError();
    if (failure) return failure;
    const result = await bundleSource.simulate({ waterLevelM: body?.water_level_m ?? 0, vehicle: body?.vehicle ?? "car" });
    const source = getSkenario() === "cadangan" ? "fallback" : "fastapi";
    return Response.json({ ...result, source });
  }),
  http.post("*/api/route", async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      village_id?: string;
      vehicle?: "car" | "truck";
      simulation?: { water_level_m?: number };
    } | null;
    await delay(250);
    const failure = failIfError();
    if (failure) return failure;
    const route = await bundleSource.route({
      villageId: body?.village_id ?? "",
      vehicle: body?.vehicle ?? "car",
      waterLevelM: body?.simulation?.water_level_m ?? 0,
    });
    return Response.json(route);
  }),
];
