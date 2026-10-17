"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/ui/number-field";
import { formatPercent } from "@/lib/format";
import { SCORE_COMPONENTS, SCORE_LABELS, weightsTotal, type ScoreWeights } from "@/lib/scoring";
import { useSettings } from "@/lib/stores/settings";
import type { PassabilityThresholds } from "@/lib/thresholds";

export function SettingsForm({ onDone }: { onDone: () => void }) {
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
