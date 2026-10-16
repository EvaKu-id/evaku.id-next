import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ProductFeature } from "@/lib/features";

interface FeatureTileProps {
  feature: ProductFeature;
  children?: ReactNode;
  className?: string;
  size?: "lg" | "md" | "sm";
}

export function FeatureTile({ feature, children, className, size = "md" }: FeatureTileProps) {
  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-[16px] border border-rule bg-surface transition-colors hover:border-brand/40", className)}>
      {children ? <div className="relative min-h-0 flex-1 border-b border-rule bg-bg">{children}</div> : null}
      <div className={cn("flex flex-col gap-1.5", size === "sm" ? "p-4" : "p-5")}>
        <p className="label-data">
          <span className="text-brand">{feature.id}</span> · fitur
        </p>
        <h3 className={cn("font-bold tracking-tight text-ink", size === "lg" ? "text-xl" : "text-lg")}>{feature.title}</h3>
        <p className="text-sm leading-relaxed text-ink-2">{feature.summary}</p>
        <Link href={feature.href} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand after:absolute after:inset-0 hover:underline">
          {feature.cta} <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
