"use client";

import type { ReactNode } from "react";
import { Drawer } from "vaul";

interface SheetProps {
  title: string;
  snapPoints: (number | string)[];
  activeSnap: number | string | null;
  onSnapChange: (snap: number | string | null) => void;
  children: ReactNode;
}

// Mobile bottom sheet that stays open; the map behind it stays usable.
export function Sheet({ title, snapPoints, activeSnap, onSnapChange, children }: SheetProps) {
  return (
    <Drawer.Root
      open
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnap}
      setActiveSnapPoint={onSnapChange}
    >
      <Drawer.Portal>
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-40 flex h-[96dvh] flex-col rounded-t-[18px] border border-rule bg-surface shadow-float outline-none"
        >
          <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-surface-3" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
