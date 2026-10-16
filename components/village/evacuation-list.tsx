import { Footprints, Car, Clock, ShieldCheck } from "lucide-react";
import { addHours, formatKm, formatMinutes, formatWib } from "@/lib/format";
import type { Evacuation } from "@/types/data";

export const EVACUATION_DISCLAIMER = "Kandidat lokasi aman berdasarkan model, ikuti arahan BPBD";

const FACILITY_LABELS: Record<string, string> = {
  school: "Sekolah",
  health: "Fasilitas kesehatan",
  hospital: "Rumah sakit",
  clinic: "Klinik",
  place_of_worship: "Rumah ibadah",
  mosque: "Masjid",
  government: "Kantor pemerintah",
  community: "Balai warga",
  shelter: "Tempat pengungsian",
};

export function facilityLabel(type: string): string {
  return FACILITY_LABELS[type] ?? type.replace(/_/g, " ");
}

interface EvacuationCardProps {
  site: Evacuation;
  runTime: string;
}

export function EvacuationCard({ site, runTime }: EvacuationCardProps) {
  const leaveBy = site.leave_before_hour === null ? null : addHours(runTime, site.leave_before_hour);
  return (
    <li className="rounded-[12px] border border-rule bg-surface p-3">
      <div className="flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-site font-data text-sm font-bold text-white">
          {site.rank}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{site.facility_name}</p>
          <p className="text-xs text-muted">
            {facilityLabel(site.facility_type)} · sumber {site.source}
          </p>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div>
              <dt className="sr-only">Jarak</dt>
              <dd className="font-data font-semibold text-ink">{formatKm(site.distance_m)}</dd>
            </div>
            <div className="flex items-center gap-1">
              <Footprints className="size-3.5 text-muted" aria-label="Jalan kaki" />
              <dd className="font-data text-ink">{formatMinutes(site.walk_minutes)}</dd>
            </div>
            <div className="flex items-center gap-1">
              <Car className="size-3.5 text-muted" aria-label="Kendaraan" />
              <dd className="font-data text-ink">{formatMinutes(site.drive_minutes)}</dd>
            </div>
          </dl>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-[6px] bg-status-limited/10 px-2 py-1 text-xs font-semibold text-ink">
            <Clock className="size-3.5 text-status-limited" aria-hidden />
            {leaveBy ? `Berangkat sebelum ${formatWib(leaveBy)}` : "Rute tetap terbuka sampai 72 jam"}
          </p>
        </div>
      </div>
    </li>
  );
}

interface EvacuationListProps {
  sites: readonly Evacuation[] | null;
  runTime: string;
  highProbability: boolean;
}

export function EvacuationList({ sites, runTime, highProbability }: EvacuationListProps) {
  return (
    <div>
      {highProbability && sites && sites.length > 0 ? (
        <ol className="space-y-2">
          {sites.map((site) => (
            <EvacuationCard key={site.facility_id} site={site} runTime={runTime} />
          ))}
        </ol>
      ) : highProbability ? (
        <p className="rounded-[12px] border border-status-cut/30 bg-status-cut/5 px-3 py-3 text-sm text-ink">
          Tidak ada lokasi aman yang bisa dicapai dalam 10 km. Evakuasi lewat rute bantuan dan titik perahu di bawah.
        </p>
      ) : (
        <p className="rounded-[12px] border border-rule bg-surface-2 px-3 py-3 text-sm text-ink-2">
          Peluang banjir desa ini belum tinggi. Pantau peringatan dan siapkan tas siaga.
        </p>
      )}
      <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {EVACUATION_DISCLAIMER}.
      </p>
    </div>
  );
}
