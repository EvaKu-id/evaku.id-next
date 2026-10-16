"use client";

import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavLinks } from "@/components/layout/nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
          <Menu />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/20" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-surface px-4 pb-6 pt-3 shadow-float"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="label-data">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Tutup menu">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <nav aria-label="Menu utama" className="mt-2">
            <NavLinks
              className="flex flex-col"
              linkClassName="block px-2 py-3 text-lg"
              onNavigate={() => setOpen(false)}
            />
          </nav>
          <Button asChild size="lg" className="mt-4 w-full">
            <Link href="/map" onClick={() => setOpen(false)}>
              Buka peta
            </Link>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
