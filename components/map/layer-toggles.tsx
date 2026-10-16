"use client";

import { Layers } from "lucide-react";
import { Popover } from "radix-ui";
import { Button } from "@/components/ui/button";
import type { MapLayersVisibility } from "@/types/map";

const LABELS: Record<keyof MapLayersVisibility, string> = {
  roads: "Status jalan",
  villages: "Warna desa",
  flood: "Genangan radar",
  places: "Titik evakuasi & posko",
  route: "Rute desa terpilih",
};

interface LayerTogglesProps {
  value: MapLayersVisibility;
  onChange: (value: MapLayersVisibility) => void;
  available?: readonly (keyof MapLayersVisibility)[];
}

export function LayerToggles({ value, onChange, available }: LayerTogglesProps) {
  const keys = available ?? (Object.keys(LABELS) as (keyof MapLayersVisibility)[]);
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary" size="sm" className="shadow-float">
          <Layers /> Lapisan
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={8} className="z-50 w-60 rounded-[12px] border border-rule bg-surface p-3 shadow-float">
          <p className="label-data mb-2">Tampilkan</p>
          <ul className="space-y-1.5">
            {keys.map((key) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--brand)]"
                    checked={value[key]}
                    onChange={(event) => onChange({ ...value, [key]: event.target.checked })}
                  />
                  {LABELS[key]}
                </label>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
