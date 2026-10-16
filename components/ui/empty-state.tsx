import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({ title, children, className }: { title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[12px] border border-dashed border-rule px-4 py-6 text-center", className)}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {children ? <p className="mt-1 text-sm text-muted">{children}</p> : null}
    </div>
  );
}
