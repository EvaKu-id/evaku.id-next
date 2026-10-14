import { describe, it, expect, beforeAll, afterAll, afterEach } from "bun:test";
import { server } from "@/mocks/server";
import { setSkenario } from "@/mocks/scenario";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => { server.resetHandlers(); setSkenario("normal"); });
afterAll(() => server.close());

const B = "http://localhost:3000";
const get = (p: string) => fetch(`${B}${p}`);

describe("skenario mock", () => {
  it("normal: desa berisi data", async () => {
    const j = await (await get("/api/desa")).json();
    expect(j.data.length).toBeGreaterThan(0);
  });
  it("kosong: desa berisi array kosong, status tetap 200", async () => {
    setSkenario("kosong");
    const r = await get("/api/desa");
    expect(r.status).toBe(200);
    expect((await r.json()).data).toEqual([]);
  });
  it("cadangan: simulasi bersumber cadangan", async () => {
    setSkenario("cadangan");
    const r = await fetch(`${B}/api/simulasi`, { method: "POST" });
    expect((await r.json()).sumber).toBe("cadangan");
  });
  it("error: semua endpoint 500", async () => {
    setSkenario("error");
    for (const p of ["/api/run/latest", "/api/ruas/status", "/api/desa", "/api/metrik"]) {
      expect((await get(p)).status).toBe(500);
    }
  });
});