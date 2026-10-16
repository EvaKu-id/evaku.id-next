import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PALETTE, PALETTE_TOKENS } from "@/lib/palette";

const css = readFileSync(join(import.meta.dir, "..", "app", "globals.css"), "utf8");

function token(name: string): string | null {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`));
  return match ? match[1].toUpperCase() : null;
}

describe("palette", () => {
  test.each(Object.entries(PALETTE_TOKENS))("%s matches its CSS token", (key, cssName) => {
    expect(token(cssName)).toBe(PALETTE[key as keyof typeof PALETTE].toUpperCase());
  });

  test("defines a single light theme", () => {
    expect(css).not.toContain(".dark");
    expect(css).toContain("color-scheme: light");
  });
});
