import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MapFrameProps {
  title: string;
  corner?: string;
  footer?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

// A framed "map sheet": the map is a bounded app window, never a backdrop behind text.
export function MapFrame({ title, corner, footer, toolbar, children, className, bodyClassName }: MapFrameProps) {
  return (
    <figure className={cn("overflow-hidden rounded-[14px] border border-rule bg-surface shadow-float", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2">
        <figcaption className="label-data truncate text-ink-2">{title}</figcaption>
        {toolbar ?? (corner ? <span className="label-data hidden sm:inline">{corner}</span> : null)}
      </div>
      <div className={cn("relative", bodyClassName)} data-lenis-prevent>
        {children}
      </div>
      {footer ? <div className="border-t border-rule px-3 py-2">{footer}</div> : null}
    </figure>
  );
}
