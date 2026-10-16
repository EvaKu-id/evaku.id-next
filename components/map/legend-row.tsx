import type { CSSProperties, ReactNode } from "react";

interface LegendRowProps {
  swatch: CSSProperties;
  children: ReactNode;
}

export function LegendRow({ swatch, children }: LegendRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-6 shrink-0 rounded-full" style={swatch} />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}
