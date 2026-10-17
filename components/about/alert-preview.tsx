"use client";

import { BellRing, Clock, MapPin, Navigation } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedEvacuation } from "@/hooks/use-featured-evacuation";
import { addHours, formatKm, formatMinutes, formatPercent, formatWib } from "@/lib/format";

// A real alert from the active region, laid out like the message a village head receives.
export function AlertPreview() {
  const featured = useFeaturedEvacuation();
  if (!featured) return <Skeleton className="h-80 w-full max-w-sm" />;
  const { village, site, runTime } = featured;
  const leave = site.leave_before_hour === null ? null : formatWib(addHours(runTime, site.leave_before_hour));

  return (
    <div className="w-full max-w-sm rounded-[20px] border border-rule bg-surface p-5 shadow-float">
      <p className="flex items-center gap-2 text-xs font-semibold text-brand">
        <BellRing className="size-4" aria-hidden /> Peringatan EvaKu · {formatWib(runTime)}
      </p>
      <p className="mt-3 text-lg font-bold leading-snug text-ink">{village.name} berpeluang tinggi terputus</p>
      <p className="text-sm text-muted">Kec. {village.district}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] bg-status-cut/10 px-3 py-2">
          <dt className="text-xs text-ink-2">Peluang banjir</dt>
          <dd className="font-data text-xl font-semibold text-status-cut">{formatPercent(village.probability ?? 0)}</dd>
        </div>
        <div className="rounded-[10px] bg-status-limited/10 px-3 py-2">
          <dt className="text-xs text-ink-2">Jalan putus dalam</dt>
          <dd className="font-data text-xl font-semibold text-ink">±{village.cutoff_hour} jam</dd>
        </div>
      </dl>
      <div className="mt-4 space-y-2 border-t border-rule pt-4 text-sm">
        <p className="flex items-start gap-2 text-ink">
          <MapPin className="mt-0.5 size-4 shrink-0 text-site" aria-hidden />
          <span>
            Mengungsi ke <span className="font-semibold">{site.facility_name}</span>, {formatKm(site.distance_m)}
          </span>
        </p>
        <p className="flex items-start gap-2 text-ink-2">
          <Navigation className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
          Jalan kaki {formatMinutes(site.walk_minutes)} · kendaraan {formatMinutes(site.drive_minutes)}
        </p>
        {leave ? (
          <p className="flex items-start gap-2 font-semibold text-ink">
            <Clock className="mt-0.5 size-4 shrink-0 text-status-limited" aria-hidden />
            Berangkat sebelum {leave}
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-[11px] text-muted">Kandidat lokasi aman berdasarkan model, ikuti arahan BPBD.</p>
    </div>
  );
}
