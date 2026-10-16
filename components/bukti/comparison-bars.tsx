"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRatio } from "@/lib/format";
import { PALETTE } from "@/lib/palette";

export interface ComparisonItem {
  label: string;
  value: number;
  emphasis: boolean;
}

interface ComparisonBarsProps {
  items: readonly ComparisonItem[];
  title: string;
  format?: (value: number) => string;
}

const BASELINE_COLOR = PALETTE.statusUnknown;
const defaultFormat = (value: number) => formatRatio(value);

export function ComparisonBars({ items, title, format = defaultFormat }: ComparisonBarsProps) {
  const data = items.map((item) => ({ ...item, fill: item.emphasis ? PALETTE.brand : BASELINE_COLOR }));
  return (
    <figure>
      <figcaption className="label-data mb-2">{title}</figcaption>
      <div className="h-44" role="img" aria-label={`${title}: ${items.map((i) => `${i.label} ${format(i.value)}`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 4 }} barCategoryGap={14}>
            <CartesianGrid horizontal={false} stroke={PALETTE.rule} strokeDasharray="2 4" />
            <XAxis type="number" domain={[0, 1]} tickFormatter={format} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 12, fill: PALETTE.ink }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: PALETTE.brandSoft }}
              formatter={(value) => [format(Number(value)), "Nilai"]}
              contentStyle={{ borderRadius: 10, border: `1px solid ${PALETTE.rule}`, fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              <LabelList dataKey="value" position="right" formatter={(value) => format(Number(value))} style={{ fontSize: 12, fill: PALETTE.ink, fontFamily: "var(--font-geist-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
