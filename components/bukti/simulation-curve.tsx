"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSimLevels } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDecimal, formatNumber } from "@/lib/format";
import { PALETTE } from "@/lib/palette";
import type { ForecastRun } from "@/types/data";

type Measure = "isolated_villages" | "cut_road_km";

interface SimulationCurveProps {
  measure: Measure;
  title: string;
  markers?: readonly ForecastRun[];
}

export function SimulationCurve({ measure, title, markers = [] }: SimulationCurveProps) {
  const levels = useSimLevels();
  if (!levels.data) return <Skeleton className="h-64" />;
  const byLevel = new Map<number, { level: number; car?: number; truck?: number }>();
  for (const row of levels.data) {
    const entry = byLevel.get(row.water_level_m) ?? { level: row.water_level_m };
    entry[row.vehicle] = row[measure];
    byLevel.set(row.water_level_m, entry);
  }
  const data = [...byLevel.values()].sort((a, b) => a.level - b.level);
  const format = measure === "cut_road_km" ? (v: number) => `${formatNumber(v)} km` : (v: number) => `${formatNumber(v)} desa`;

  return (
    <figure>
      <figcaption className="label-data mb-2">{title}</figcaption>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid vertical={false} stroke={PALETTE.rule} strokeDasharray="2 4" />
            <XAxis dataKey="level" type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tickFormatter={(v: number) => `${v} m`} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={{ stroke: PALETTE.rule }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              labelFormatter={(value) => `Tinggi air ${formatDecimal(Number(value))} m`}
              formatter={(value, name) => [format(Number(value)), name === "car" ? "Mobil" : "Truk / 4x4"]}
              contentStyle={{ borderRadius: 10, border: `1px solid ${PALETTE.rule}`, fontSize: 12 }}
            />
            <Legend formatter={(value) => (value === "car" ? "Mobil" : "Truk / 4x4")} wrapperStyle={{ fontSize: 12 }} />
            {markers.map((run) => (
              <ReferenceLine key={run.run_id} x={run.water_level_m} stroke={PALETTE.muted} strokeDasharray="3 3" label={{ value: `${run.horizon_hours} j`, position: "top", fontSize: 10, fill: PALETTE.muted }} />
            ))}
            <Line type="monotone" dataKey="car" stroke={PALETTE.brand} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="truck" stroke={PALETTE.ink} strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
