import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Tone = "bg" | "deep" | "surface";

const TONES: Record<Tone, string> = {
  bg: "bg-bg",
  deep: "bg-bg-deep",
  surface: "bg-surface",
};

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  tone?: Tone;
  bordered?: boolean;
}

export function Section({ tone = "bg", bordered = true, className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("relative py-16 sm:py-24", TONES[tone], bordered && "border-t border-rule", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
