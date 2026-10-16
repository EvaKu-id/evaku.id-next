import { cn } from "@/lib/cn";

export type OrnamentName = "contours" | "river" | "route-sample" | "indonesia";

interface OrnamentProps {
  name: OrnamentName;
  className?: string;
}

export function Ornament({ name, className }: OrnamentProps) {
  const url = `url(/ornaments/${name}.svg)`;
  return (
    <div
      aria-hidden
      className={cn("ornament-mask pointer-events-none", className)}
      style={{ maskImage: url, WebkitMaskImage: url }}
    />
  );
}
