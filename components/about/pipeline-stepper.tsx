"use client";

import { Tabs } from "radix-ui";
import { PIPELINE_STAGES as STAGES } from "@/lib/content/about";

export function PipelineStepper() {
  return (
    <Tabs.Root defaultValue={STAGES[0].id} className="grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[280px_1fr]">
      <Tabs.List aria-label="Tahap kerja EvaKu" className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col" data-lenis-prevent>
        {STAGES.map((stage, index) => (
          <Tabs.Trigger
            key={stage.id}
            value={stage.id}
            className="flex shrink-0 items-center gap-3 rounded-[10px] border border-rule bg-surface px-3 py-2.5 text-left text-sm font-semibold text-ink-2 transition-colors hover:border-brand/40 data-[state=active]:border-brand data-[state=active]:bg-brand-soft data-[state=active]:text-ink"
          >
            <span className="font-data text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
            <stage.icon className="size-4" aria-hidden />
            {stage.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {STAGES.map((stage) => (
        <Tabs.Content key={stage.id} value={stage.id} className="min-w-0 rounded-[14px] border border-rule bg-surface p-5 sm:p-6">
          <h3 className="text-xl font-bold text-ink">{stage.title}</h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-2">{stage.summary}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <ul className="flex flex-wrap gap-2">
              {stage.inputs.map((input) => (
                <li key={input} className="rounded-[6px] border border-rule bg-surface-2 px-2 py-1 font-data text-xs text-ink">{input}</li>
              ))}
            </ul>
            <span aria-hidden className="hidden h-px w-16 bg-brand sm:block" />
            <p className="rounded-[10px] border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-semibold text-ink">{stage.output}</p>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
