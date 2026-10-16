"use client";

import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SourceNote } from "@/components/ui/source-note";

interface StatProps {
  value: number;
  label: ReactNode;
  unit?: string;
  decimals?: number;
  source?: ReactNode;
  tone?: "ink" | "brand" | "cut" | "limited";
  size?: "md" | "lg";
  className?: string;
}

const TONE_CLASS = {
  ink: "text-ink",
  brand: "text-brand",
  cut: "text-status-cut",
  limited: "text-status-limited",
} as const;

export function Stat({
  value,
  label,
  unit,
  decimals = 0,
  source,
  tone = "ink",
  size = "md",
  className,
}: StatProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("min-w-0", className)}>
      <p
        className={cn(
          "font-data font-semibold tracking-tight",
          TONE_CLASS[tone],
          size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
        )}
      >
        <NumberFlow
          value={value}
          locales="id-ID"
          format={{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
          animated={!reduced}
        />
        {unit ? <span className="ml-1 text-base font-medium text-muted">{unit}</span> : null}
      </p>
      <p className="mt-1 text-sm text-ink-2">{label}</p>
      {source ? <SourceNote className="mt-1">{source}</SourceNote> : null}
    </div>
  );
}
