// MapLibre expressions and canvas drawing cannot read CSS variables, so the map colors live here.
// Keep these values in sync with the tokens in app/globals.css (checked by tests/palette.test.ts).
export const PALETTE = {
  bg: "#F4F8FC",
  surface: "#FFFFFF",
  ink: "#0B1B2E",
  muted: "#5B6E84",
  rule: "#D5E1EE",
  brand: "#0B63CE",
  brandSoft: "#E3EEFB",
  water1: "#BFE3F7",
  water2: "#6BB8E8",
  water3: "#2B7FC9",
  statusSafe: "#94A3B8",
  statusLimited: "#D97706",
  statusCut: "#E11D48",
  statusUnknown: "#64748B",
  probLow: "#CBD5E1",
  probMid: "#F59E0B",
  probHigh: "#DC2626",
  site: "#0F8A5F",
} as const;

// Map-only colours with no CSS counterpart.
export const MAP_COLORS = { basemapWater: "#D3E6F7", provinceEmpty: "#EEF3F8" } as const;

export const REPLAY_COLORS = { tp: "#0F8A5F", fp: "#F59E0B", fn: "#E11D48" } as const;

export const PALETTE_TOKENS: Record<keyof typeof PALETTE, string> = {
  bg: "--bg",
  surface: "--surface",
  ink: "--ink",
  muted: "--muted",
  rule: "--rule",
  brand: "--brand",
  brandSoft: "--brand-soft",
  water1: "--water-1",
  water2: "--water-2",
  water3: "--water-3",
  statusSafe: "--status-safe",
  statusLimited: "--status-limited",
  statusCut: "--status-cut",
  statusUnknown: "--status-unknown",
  probLow: "--prob-low",
  probMid: "--prob-mid",
  probHigh: "--prob-high",
  site: "--site",
};

export const NATIONAL_SCALE = ["#EAF3FC", "#C6E0F6", "#8DC1EC", "#4D96D8", "#1E64B0"] as const;

export const WEIGHT_SHADES = ["#0B63CE", "#2B7FC9", "#6BB8E8", "#9CCFF0", "#C6E4F7"] as const;
