"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/format";
import { SCORE_COMPONENTS, SCORE_LABELS, weightsTotal, type ScoreWeights } from "@/lib/scoring";
import { useSettings } from "@/lib/stores/settings";
import type { PassabilityThresholds } from "@/lib/thresholds";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NumberField({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix: string }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-2">{label}</span>
      <span className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || 0)))}
          className="h-9 w-24 rounded-[8px] border border-rule bg-surface px-2 font-data text-sm text-ink"
        />
        <span className="text-sm text-muted">{suffix}</span>
      </span>
    </label>
  );
}

function SettingsForm({ onDone }: { onDone: () => void }) {
  const stored = useSettings();
  const [thresholds, setThresholds] = useState<PassabilityThresholds>(stored.thresholds);
  const [weights, setWeights] = useState<ScoreWeights>(stored.weights);
  const total = weightsTotal(weights);
  const valid = Math.abs(total - 1) < 0.001 && thresholds.car_cm <= thresholds.truck_cm;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        stored.setThresholds(thresholds);
        stored.setWeights(weights);
        onDone();
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="label-data mb-2">Ambang kedalaman kendaraan</legend>
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Mobil" value={thresholds.car_cm} min={0} max={100} suffix="cm" onChange={(car_cm) => setThresholds({ ...thresholds, car_cm })} />
          <NumberField label="Truk / 4x4" value={thresholds.truck_cm} min={0} max={150} suffix="cm" onChange={(truck_cm) => setThresholds({ ...thresholds, truck_cm })} />
        </div>
        {thresholds.car_cm > thresholds.truck_cm ? (
          <p className="mt-2 text-xs text-status-cut">Ambang mobil tidak boleh melebihi truk.</p>
        ) : null}
      </fieldset>
      <fieldset>
        <legend className="label-data mb-2">Bobot skor prioritas</legend>
        <ul className="space-y-3">
          {SCORE_COMPONENTS.map((component) => (
            <li key={component}>
              <label className="flex items-center gap-3 text-sm">
                <span className="w-44 shrink-0 text-ink-2">{SCORE_LABELS[component]}</span>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={Math.round(weights[component] * 100)}
                  onChange={(event) => setWeights({ ...weights, [component]: Number(event.target.value) / 100 })}
                  className="flex-1 accent-[var(--brand)]"
                />
                <span className="w-10 text-right font-data text-ink">{formatPercent(weights[component])}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className={`mt-2 text-xs ${valid ? "text-muted" : "text-status-cut"}`}>
          Total bobot {formatPercent(total)}{valid ? "" : " — harus 100%"}
        </p>
      </fieldset>
      <p className="text-xs text-muted">Pengaturan berlaku di perangkat ini.</p>
      <div className="flex flex-wrap justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            stored.reset();
            onDone();
          }}
        >
          <RotateCcw /> Kembalikan default
        </Button>
        <Button type="submit" disabled={!valid}>Simpan</Button>
      </div>
    </form>
  );
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
