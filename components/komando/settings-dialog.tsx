"use client";

import { SlidersHorizontal } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { SettingsForm } from "@/components/komando/settings-form";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" size="sm">
          <SlidersHorizontal /> Pengaturan
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/25" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[min(520px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] border border-rule bg-surface p-6 shadow-float" data-lenis-prevent>
          <Dialog.Title className="text-lg font-bold text-ink">Ambang dan bobot</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-ink-2">
            Sesuaikan dengan kondisi kendaraan dan prioritas posko. Status jalan dan ranking desa langsung dihitung ulang.
          </Dialog.Description>
          <div className="mt-5">{open ? <SettingsForm onDone={() => onOpenChange(false)} /> : null}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
