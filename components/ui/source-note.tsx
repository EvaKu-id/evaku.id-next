import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SourceNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-data text-[11px] leading-4 text-muted", className)}>{children}</p>;
}
