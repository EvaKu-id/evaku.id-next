"use client";

import { Slider } from "radix-ui";
import { cn } from "@/lib/cn";
import { formatDecimal } from "@/lib/format";

interface WaterGaugeProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  orientation?: "vertical" | "horizontal";
  valueText?: string;
  className?: string;
}

// A staff gauge ("papan duga"): the track reads like the marked pole used at river stations.
export function WaterGauge({
  value,
  onChange,
  max = 5,
  step = 0.1,
  orientation = "vertical",
  valueText,
  className,
}: WaterGaugeProps) {
  const vertical = orientation === "vertical";
  const ticks = Array.from({ length: Math.round(max / 0.5) + 1 }, (_, i) => i * 0.5);
  return (
    <div className={cn("flex gap-3", vertical ? "h-full flex-row" : "flex-col", className)}>
      <div className={cn("relative", vertical ? "h-full w-10" : "h-10 w-full")}>
        <Slider.Root
          value={[value]}
          min={0}
          max={max}
          step={step}
          orientation={orientation}
          onValueChange={([next]) => onChange(Number(next.toFixed(1)))}
          className={cn("relative flex touch-none select-none", vertical ? "h-full w-10 flex-col items-center" : "h-10 w-full items-center")}
        >
          <Slider.Track
            className={cn(
              "relative overflow-hidden rounded-[6px] border border-rule bg-[repeating-linear-gradient(var(--tw-gradient-angle,0deg),transparent_0_9px,var(--rule)_9px_10px)] bg-surface",
              vertical ? "h-full w-4" : "h-4 w-full",
            )}
          >
            <Slider.Range className={cn("absolute bg-water-2", vertical ? "w-full" : "h-full")} />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Tinggi air di atas normal"
            aria-valuetext={valueText ?? `${formatDecimal(value)} meter`}
            className="block h-5 w-9 rounded-[6px] border-2 border-brand bg-surface shadow-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
        </Slider.Root>
      </div>
      <ol
        aria-hidden
        className={cn(
          "pointer-events-none flex font-data text-[10px] text-muted",
          vertical ? "h-full flex-col-reverse justify-between py-1" : "w-full justify-between px-1",
        )}
      >
        {ticks
          .filter((tick) => Number.isInteger(tick) || max <= 3)
          .map((tick) => (
            <li key={tick}>{formatDecimal(tick)}</li>
          ))}
      </ol>
    </div>
  );
}
