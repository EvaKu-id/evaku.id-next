import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

interface CalcBlockProps {
  title: string;
  children: ReactNode;
  formula?: string;
  visual: ReactNode;
  id?: string;
}

export function CalcBlock({ title, children, formula, visual, id }: CalcBlockProps) {
  return (
    <Reveal>
      <article id={id} className="grid grid-cols-1 [&>*]:min-w-0 gap-6 border-t border-rule py-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-tight text-ink">{title}</h3>
          <div className="mt-3 space-y-3 leading-relaxed text-ink-2">{children}</div>
          {formula ? (
            <pre className="mt-4 overflow-x-auto rounded-[10px] border border-rule bg-surface-2 px-4 py-3 font-data text-sm text-ink">{formula}</pre>
          ) : null}
        </div>
        <div className="min-w-0">{visual}</div>
      </article>
    </Reveal>
  );
}
