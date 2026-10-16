import { Car, Truck } from "lucide-react";
import { RoadStatusSwatch } from "@/components/ui/status";
import { DEFAULT_THRESHOLDS } from "@/lib/thresholds";

const MAX_CM = 90;
const BANDS = [
  { from: 0, to: DEFAULT_THRESHOLDS.car_cm, status: 0 as const, label: "Aman untuk semua" },
  { from: DEFAULT_THRESHOLDS.car_cm, to: DEFAULT_THRESHOLDS.truck_cm, status: 1 as const, label: "Terbatas: hanya truk/4x4" },
  { from: DEFAULT_THRESHOLDS.truck_cm, to: MAX_CM, status: 2 as const, label: "Putus" },
];

export function ThresholdColumns() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 rounded-[14px] border border-rule bg-surface p-5">
      <div className="relative h-60 w-24 overflow-hidden rounded-[8px] border border-rule bg-surface-2">
        {BANDS.map((band) => (
          <div
            key={band.status}
            className="absolute inset-x-0 border-t border-surface"
            style={{
              bottom: `${(band.from / MAX_CM) * 100}%`,
              height: `${((band.to - band.from) / MAX_CM) * 100}%`,
              backgroundColor: band.status === 0 ? "var(--water-1)" : band.status === 1 ? "var(--water-2)" : "var(--water-3)",
            }}
          />
        ))}
        {[DEFAULT_THRESHOLDS.car_cm, DEFAULT_THRESHOLDS.truck_cm].map((cm) => (
          <span key={cm} className="absolute right-1 font-data text-[10px] font-semibold text-ink" style={{ bottom: `calc(${(cm / MAX_CM) * 100}% + 2px)` }}>
            {cm} cm
          </span>
        ))}
      </div>
      <ul className="flex flex-col-reverse justify-between py-2">
        {BANDS.map((band) => (
          <li key={band.status} className="flex items-center gap-3 text-sm text-ink">
            <RoadStatusSwatch status={band.status} />
            <span>
              <span className="font-semibold">{band.label}</span>
              <span className="block font-data text-xs text-muted">
                {band.from}–{band.to === MAX_CM ? "…" : band.to} cm
              </span>
            </span>
            {band.status === 0 ? <Car className="ml-auto size-5 text-muted" aria-label="Mobil" /> : null}
            {band.status === 1 ? <Truck className="ml-auto size-5 text-muted" aria-label="Truk" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
