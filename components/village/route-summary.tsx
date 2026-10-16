import { Anchor, Truck } from "lucide-react";
import { formatKm, formatMinutes } from "@/lib/format";
import type { Route } from "@/types/data";

export function RouteSummary({ route }: { route: Route | null }) {
  if (!route) {
    return (
      <p className="rounded-[12px] border border-rule bg-surface-2 px-3 py-3 text-sm text-ink-2">
        Desa terjangkau lewat jalan biasa dari posko terdekat.
      </p>
    );
  }
  const Icon = route.mode === "boat" ? Anchor : Truck;
  return (
    <div className="rounded-[12px] border border-rule bg-surface p-3">
      <p className="flex items-start gap-2 text-sm font-semibold text-ink">
        <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        {route.recommendation}
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-muted">Dari</dt>
          <dd className="truncate font-semibold text-ink">{route.hub_name}</dd>
        </div>
        <div>
          <dt className="text-muted">Darat</dt>
          <dd className="font-data font-semibold text-ink">
            {formatKm(route.distance_m)} · {formatMinutes(route.minutes)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Perahu</dt>
          <dd className="font-data font-semibold text-ink">
            {route.boat_point ? formatKm(route.boat_point.water_distance_m) : "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
