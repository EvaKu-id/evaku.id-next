"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useManifest } from "@/hooks/use-data";
import { formatDecimal, formatNumber } from "@/lib/format";
import { PALETTE } from "@/lib/palette";

export const RATING = { a: -12.1368, b: 2.208 } as const;

export function levelFromDischarge(q: number): number {
  return RATING.a + RATING.b * Math.log(q);
}

const DATA = Array.from({ length: 45 }, (_, i) => {
  const q = 250 + i * 25;
  return { q, level: Math.max(0, levelFromDischarge(q)) };
});

export function RatingCurve() {
  const manifest = useManifest();
  return (
    <figure>
      <figcaption className="label-data mb-2">Tinggi air dari debit sungai</figcaption>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke={PALETTE.rule} strokeDasharray="2 4" />
            <XAxis dataKey="q" type="number" domain={[250, 1350]} tickFormatter={(v: number) => formatNumber(v)} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={{ stroke: PALETTE.rule }} tickLine={false} label={{ value: "debit m³/s", position: "insideBottomRight", offset: -2, fontSize: 10, fill: PALETTE.muted }} />
            <YAxis tickFormatter={(v: number) => `${formatDecimal(v)} m`} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={false} tickLine={false} width={52} />
            <Tooltip formatter={(v) => [`${formatDecimal(Number(v))} m`, "Tinggi air"]} labelFormatter={(v) => `Debit ${formatNumber(Number(v))} m³/s`} contentStyle={{ borderRadius: 10, border: `1px solid ${PALETTE.rule}`, fontSize: 12 }} />
            <Line dataKey="level" stroke={PALETTE.brand} strokeWidth={2} dot={false} isAnimationActive={false} />
            {(manifest.data?.forecast_runs ?? []).map((run) => (
              <ReferenceDot key={run.run_id} x={run.discharge_m3s} y={levelFromDischarge(run.discharge_m3s)} r={5} fill={PALETTE.surface} stroke={PALETTE.brand} strokeWidth={2} label={{ value: `${run.horizon_hours} j`, position: "top", fontSize: 10, fill: PALETTE.ink }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
