import type { AddLayerObject } from "maplibre-gl";

type LinePaint = NonNullable<Extract<AddLayerObject, { type: "line" }>["paint"]>;
type FillPaint = NonNullable<Extract<AddLayerObject, { type: "fill" }>["paint"]>;
type WidthStops = readonly (readonly [zoom: number, width: number])[];

export type RoadTier = "major" | "minor" | "path";

export interface RoadTierStyle {
  tier: RoadTier;
  classes: readonly string[];
  minzoom: number;
  safeWidth: WidthStops;
  problemWidth: WidthStops;
}

export const ROAD_TIERS: readonly RoadTierStyle[] = [
  {
    tier: "major",
    classes: [
      "motorway",
      "trunk",
      "primary",
      "secondary",
      "tertiary",
      "motorway_link",
      "trunk_link",
      "primary_link",
      "secondary_link",
      "tertiary_link",
    ],
    minzoom: 8,
    safeWidth: [[8, 0.8], [12, 2], [15, 4]],
    problemWidth: [[8, 2], [12, 4], [15, 7]],
  },
  {
    tier: "minor",
    classes: ["unclassified", "residential", "living_street", "road"],
    minzoom: 11,
    safeWidth: [[11, 0.5], [13, 1], [15, 2.5]],
    problemWidth: [[11, 1.5], [13, 3], [15, 5]],
  },
  {
    tier: "path",
    classes: ["track", "service"],
    minzoom: 13,
    safeWidth: [[13, 0.4], [16, 1.5]],
    problemWidth: [[13, 1.2], [16, 3]],
  },
];

export const ROAD_STATUS_COLORS = {
  safe: "#94a3b8",
  limited: "#d97706",
  cut: "#e11d48",
  unknown: "#64748b",
  hover: "#0284c7",
} as const;

export const VILLAGE_STATUS_COLORS = {
  fully_isolated: "#e11d48",
  partially_isolated: "#d97706",
} as const;

const CUT_DASH_RATIO = 0.4;
const HOVER_EXTRA_PX = 1;

export function roadLineId(tier: RoadTier): string {
  return `roads-${tier}`;
}

export function roadCutId(tier: RoadTier): string {
  return `roads-${tier}-cut`;
}

export const ROAD_LINE_LAYER_IDS = ROAD_TIERS.map(({ tier }) => roadLineId(tier));

type FilterExpression = NonNullable<Extract<AddLayerObject, { type: "line" }>["filter"]>;
type Expression = Extract<NonNullable<LinePaint["line-opacity"]>, readonly unknown[]>;
type InterpolateStop = number | Expression;

// Classes outside every list still need a tier, so "minor" also takes whatever major and path do not.
export function roadTierFilter(style: RoadTierStyle): FilterExpression {
  if (style.tier !== "minor") {
    return ["in", ["get", "highway_type"], ["literal", [...style.classes]]];
  }
  const others = ROAD_TIERS.filter(({ tier }) => tier !== "minor").flatMap((t) => t.classes);
  return ["!", ["in", ["get", "highway_type"], ["literal", others]]];
}

const status: Expression = ["to-number", ["feature-state", "status"], 0];
const hovered: Expression = ["boolean", ["feature-state", "hover"], false];
const problem: Expression = [">=", status, 1];

function interpolateZoom(stops: InterpolateStop[]): Expression {
  return ["interpolate", ["linear"], ["zoom"], ...stops];
}

export function roadColor(): LinePaint["line-color"] {
  return [
    "case",
    hovered,
    ROAD_STATUS_COLORS.hover,
    [
      "match",
      status,
      1,
      ROAD_STATUS_COLORS.limited,
      2,
      ROAD_STATUS_COLORS.cut,
      3,
      ROAD_STATUS_COLORS.unknown,
      ROAD_STATUS_COLORS.safe,
    ],
  ];
}

export function roadOpacity(): LinePaint["line-opacity"] {
  return ["case", ["any", problem, hovered], 1, 0.55];
}

export function roadWidth(style: RoadTierStyle): LinePaint["line-width"] {
  const stops = style.safeWidth.flatMap(([zoom, safe], i): InterpolateStop[] => {
    const bad = style.problemWidth[i]?.[1] ?? safe;
    return [zoom, ["+", ["case", problem, bad, safe], ["case", hovered, HOVER_EXTRA_PX, 0]]];
  });
  return interpolateZoom(stops);
}

export function roadCutWidth(style: RoadTierStyle): LinePaint["line-width"] {
  return interpolateZoom(
    style.problemWidth.flatMap(([zoom, width]) => [zoom, width * CUT_DASH_RATIO]),
  );
}

export function roadCutOpacity(): LinePaint["line-opacity"] {
  return ["case", ["==", status, 2], 0.95, 0];
}

export function villageFillColor(): FillPaint["fill-color"] {
  return [
    "match",
    ["coalesce", ["feature-state", "status"], "none"],
    "fully_isolated",
    VILLAGE_STATUS_COLORS.fully_isolated,
    VILLAGE_STATUS_COLORS.partially_isolated,
  ];
}

export function villageFillOpacity(): FillPaint["fill-opacity"] {
  return [
    "match",
    ["coalesce", ["feature-state", "status"], "none"],
    "fully_isolated",
    0.22,
    "partially_isolated",
    0.12,
    0,
  ];
}
