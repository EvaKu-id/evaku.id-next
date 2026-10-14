import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";

function listJson(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listJson(p);
    return e.name.endsWith(".json") ? [p] : [];
  });
}

describe("fixture JSON", () => {
  const files = listJson("mocks/fixtures");

  it("ada fixture", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`valid dan tidak kosong: ${file}`, () => {
      const text = fs.readFileSync(file, "utf8");
      expect(text.trim().length, "file kosong").toBeGreaterThan(0);
      expect(() => JSON.parse(text)).not.toThrow();
    });
  }
});