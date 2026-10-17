"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPercent } from "@/lib/format";
import { PALETTE } from "@/lib/palette";

export interface LeadTimePoint {
  horizon: number;
  value: number;
}

export function LeadTimeChart({ values }: { values: readonly LeadTimePoint[] }) {
  return (
    <figure>
      <figcaption className="label-data mb-2">Desa terputus yang sudah diperingatkan sebelumnya</figcaption>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={values} margin={{ top: 20, right: 8, bottom: 4, left: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={PALETTE.rule} strokeDasharray="2 4" />
            <XAxis dataKey="horizon" tickFormatter={(v: number) => `${v} jam sebelum`} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={{ stroke: PALETTE.rule }} tickLine={false} />
            <YAxis domain={[0, 1]} tickFormatter={(v: number) => formatPercent(v)} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={false} tickLine={false} width={44} />
            <Tooltip formatter={(v) => [formatPercent(Number(v)), "Tertangkap"]} labelFormatter={(v) => `${v} jam sebelum puncak`} contentStyle={{ borderRadius: 10, border: `1px solid ${PALETTE.rule}`, fontSize: 12 }} cursor={{ fill: PALETTE.brandSoft }} />
            <Bar dataKey="value" fill={PALETTE.brand} radius={[4, 4, 0, 0]} isAnimationActive={false}>
              <LabelList dataKey="value" position="top" formatter={(v) => formatPercent(Number(v))} style={{ fontSize: 12, fill: PALETTE.ink, fontFamily: "var(--font-geist-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
