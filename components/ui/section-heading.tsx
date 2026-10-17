import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  label,
  title,
  intro,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="label-data">{label}</p>
      <Heading className={cn("mt-3 text-ink", Heading === "h1" ? "text-display" : "text-h2")}>
        {title}
      </Heading>
      {intro ? <p className="mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">{intro}</p> : null}
    </div>
  );
}
