"use client";

import { ChevronDown } from "lucide-react";
import { Accordion } from "radix-ui";
import { FAQ_ITEMS as ITEMS } from "@/lib/content/about";

export function Faq() {
  return (
    <Accordion.Root type="single" collapsible defaultValue={ITEMS[0][0]} className="divide-y divide-rule rounded-[14px] border border-rule bg-surface">
      {ITEMS.map(([question, answer]) => (
        <Accordion.Item key={question} value={question}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink hover:text-brand">
              {question}
              <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed text-ink-2">{answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
