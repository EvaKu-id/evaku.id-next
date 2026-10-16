"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { VillageStatusBadge } from "@/components/ui/status";
import type { RunVillage } from "@/types/data";

interface VillageSearchProps {
  villages: readonly RunVillage[];
  onSelect: (villageId: string) => void;
}

export function VillageSearch({ villages, onSelect }: VillageSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex h-9 w-full min-w-0 items-center gap-2 rounded-[8px] border border-rule bg-surface px-3 text-sm text-muted shadow-float hover:border-brand/40 sm:w-56"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 truncate text-left">Cari desa</span>
          <kbd className="hidden font-data text-[10px] sm:inline">Ctrl K</kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/25" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-50 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[14px] border border-rule bg-surface shadow-float"
        >
          <Dialog.Title className="sr-only">Cari desa</Dialog.Title>
          <Command label="Cari desa" loop>
            <div className="flex items-center gap-2 border-b border-rule px-3">
              <Search className="size-4 text-muted" aria-hidden />
              <Command.Input placeholder="Nama desa atau kecamatan" className="h-12 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted" />
            </div>
            <Command.List className="max-h-[50vh] overflow-y-auto p-1.5" data-lenis-prevent>
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted">Desa tidak ditemukan.</Command.Empty>
              {villages.map((village) => (
                <Command.Item
                  key={village.village_id}
                  value={`${village.name} ${village.district} ${village.village_id}`}
                  onSelect={() => {
                    onSelect(village.village_id);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 text-sm data-[selected=true]:bg-brand-soft"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{village.name}</p>
                    <p className="truncate text-xs text-muted">Kec. {village.district}</p>
                  </div>
                  {village.status !== "reachable" ? <VillageStatusBadge status={village.status} /> : null}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
