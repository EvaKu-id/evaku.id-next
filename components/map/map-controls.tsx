"use client";

import { Segmented, type SegmentedOption } from "@/components/ui/segmented";
import { WaterGauge } from "@/components/map/water-gauge";
import { formatDateShort, formatDecimal, formatWib } from "@/lib/format";
import { HORIZONS } from "@/lib/forecast";
import type { Horizon, Manifest, MapMode, Vehicle } from "@/types/data";

export const MODE_OPTIONS: readonly SegmentedOption<MapMode>[] = [
  { value: "prakiraan", label: "Prakiraan", hint: "Peluang banjir 24–72 jam" },
  { value: "radar", label: "Radar", hint: "Genangan dari citra Sentinel-1" },
  { value: "simulasi", label: "Simulasi", hint: "Skenario tinggi air 0–5 m" },
];

export const VEHICLE_OPTIONS: readonly SegmentedOption<Vehicle>[] = [
  { value: "car", label: "Mobil", hint: "Lewat sampai genangan 30 cm" },
  { value: "truck", label: "Truk / 4x4", hint: "Lewat sampai genangan 60 cm" },
];

const HORIZON_OPTIONS: readonly SegmentedOption<`${Horizon}`>[] = HORIZONS.map((h) => ({
  value: `${h}` as const,
  label: `${h} jam`,
}));

interface ModeControlsProps {
  mode: MapMode;
  manifest: Manifest | undefined;
  horizon: Horizon;
  date: string | null;
  level: number;
  vehicle: Vehicle;
  computing: boolean;
  onHorizon: (horizon: Horizon) => void;
  onDate: (date: string) => void;
  onLevel: (level: number) => void;
  onVehicle: (vehicle: Vehicle) => void;
  layout?: "vertical" | "horizontal";
}

export function ModeControls({
  mode,
  manifest,
  horizon,
  date,
  level,
  vehicle,
  computing,
  onHorizon,
  onDate,
  onLevel,
  onVehicle,
  layout = "vertical",
}: ModeControlsProps) {
  const radarRuns = manifest?.radar_runs ?? [];
  const activeDate = date ?? radarRuns[0]?.date ?? "";
  const activeRadar = radarRuns.find((run) => run.date === activeDate);
  const forecast = manifest?.forecast_runs.find((run) => run.horizon_hours === horizon);

  return (
    <div className="space-y-3">
      {mode === "prakiraan" ? (
        <div>
          <p className="label-data mb-1.5">Horizon prakiraan</p>
          <Segmented
            label="Horizon prakiraan"
            value={`${horizon}`}
            options={HORIZON_OPTIONS}
            onChange={(value) => onHorizon(Number(value) as Horizon)}
          />
          {forecast ? (
            <p className="mt-1.5 text-xs text-muted">
              Perkiraan tinggi Sungai {formatDecimal(forecast.water_level_m)} m · debit{" "}
              {formatDecimal(forecast.discharge_m3s)} m³/s
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "radar" ? (
        <div>
          <p className="label-data mb-1.5">Tanggal citra</p>
          <Segmented
            label="Tanggal citra radar"
            value={activeDate}
            options={radarRuns.map((run) => ({ value: run.date, label: formatDateShort(run.date) }))}
            onChange={onDate}
          />
          {activeRadar ? (
            <p className="mt-1.5 text-xs text-muted">Citra diambil {formatWib(activeRadar.acquired_at)}</p>
          ) : null}
        </div>
      ) : null}

      {mode === "simulasi" ? (
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <p className="label-data">Tinggi air</p>
            <p className="font-data text-2xl font-semibold text-brand">
              {formatDecimal(level)}
              <span className="ml-0.5 text-sm text-muted">m</span>
            </p>
          </div>
          <div className={layout === "vertical" ? "h-44" : ""}>
            <WaterGauge value={level} onChange={onLevel} orientation={layout} />
          </div>
          <p className="mt-1.5 text-xs text-muted" aria-live="polite">
            {computing ? "Menghitung ulang…" : `Di atas muka air normal ${manifest?.region.river.name ?? "sungai"}`}
          </p>
        </div>
      ) : null}

      <div>
        <p className="label-data mb-1.5">Kendaraan</p>
        <Segmented label="Jenis kendaraan" value={vehicle} options={VEHICLE_OPTIONS} onChange={onVehicle} size="sm" />
      </div>
    </div>
  );
}
