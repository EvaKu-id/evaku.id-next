import { formatMinutes, formatNumber } from "@/lib/format";
import type { VillageDetail } from "@/types/data";

interface ImpactGridProps {
  village: VillageDetail;
}

function Cell({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "cut" }) {
  return (
    <div className="rounded-[10px] border border-rule bg-surface px-3 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-0.5 font-data text-lg font-semibold ${tone === "cut" ? "text-status-cut" : "text-ink"}`}>{value}</dd>
      {hint ? <dd className="text-[11px] text-muted">{hint}</dd> : null}
    </div>
  );
}

export function ImpactGrid({ village }: ImpactGridProps) {
  const { run } = village;
  const normal = village.travel_minutes_normal;
  const now = run.travel_minutes_now;
  return (
    <dl className="grid grid-cols-2 gap-2">
      <Cell label="Warga terisolasi" value={formatNumber(run.isolated_population)} hint={`dari ${formatNumber(village.population)} warga`} tone={run.isolated_population > 0 ? "cut" : undefined} />
      <Cell label="Warga tergenang" value={formatNumber(run.flooded_population)} />
      <Cell label="Balita" value={formatNumber(village.children_under5)} />
      <Cell label="Lansia" value={formatNumber(village.elderly)} />
      <Cell label="Faskes · sekolah" value={`${village.health_facilities} · ${village.schools}`} hint="di dalam desa" />
      <Cell
        label="Waktu tempuh dari posko"
        value={now === null ? "Terputus" : formatMinutes(now)}
        hint={normal === null ? undefined : `normal ${formatMinutes(normal)}`}
        tone={now === null ? "cut" : undefined}
      />
    </dl>
  );
}
