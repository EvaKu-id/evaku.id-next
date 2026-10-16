import { describe, it, expect, afterEach } from "bun:test";
import { getResponse } from "msw";
import { handlers } from "@/mocks/handlers";
import { setSkenario } from "@/mocks/scenario";

afterEach(() => setSkenario("normal"));

const B = "http://localhost:3000";

// MSW's node interceptors cannot patch Bun's TLS sockets, so handlers are called directly.
async function get(p: string, init?: RequestInit): Promise<Response> {
  const res = await getResponse(handlers, new Request(`${B}${p}`, init));
  if (!res) throw new Error(`no mock handler for ${p}`);
  return res;
}

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
    const r = await get("/api/simulasi", { method: "POST" });
    expect((await r.json()).sumber).toBe("cadangan");
  });
  it("error: semua endpoint 500", async () => {
    setSkenario("error");
    for (const p of ["/api/run/latest", "/api/ruas/status", "/api/desa", "/api/metrik"]) {
      expect((await get(p)).status).toBe(500);
    }
  });
});
