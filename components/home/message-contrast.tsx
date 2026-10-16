"use client";

import { BellRing, MapPinned } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useManifest } from "@/hooks/use-data";
import { useFeaturedEvacuation } from "@/hooks/use-featured-evacuation";
import { addHours, formatKm, formatWib } from "@/lib/format";

export function MessageContrast() {
  const manifest = useManifest();
  const featured = useFeaturedEvacuation();
  const regency = manifest.data?.region.name;
  const leave =
    featured && featured.site.leave_before_hour !== null
      ? formatWib(addHours(featured.runTime, featured.site.leave_before_hour))
      : null;

  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid w-full max-w-6xl gap-0 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <Reveal className="border-rule pb-10 lg:border-r lg:pb-0 lg:pr-12">
          <p className="label-data flex items-center gap-2"><BellRing className="size-4" aria-hidden /> Peringatan biasa</p>
          <p className="mt-5 text-2xl font-semibold leading-snug text-muted sm:text-3xl">
            “Waspada potensi banjir di {regency ?? "kabupaten Anda"} dalam tiga hari ke depan.”
          </p>
          <p className="mt-4 text-sm text-ink-2">Benar, tapi sulit ditindaklanjuti: desa mana, jalan mana, harus ke mana?</p>
        </Reveal>
        <Reveal delay={0.08} className="border-t border-rule pt-10 lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="label-data flex items-center gap-2 text-brand"><MapPinned className="size-4" aria-hidden /> EvaKu</p>
          <div className="mt-5 text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            {featured ? (
              <p>
                “{featured.village.name} berpeluang tinggi terputus dalam{" "}
                <span className="text-status-cut">±{featured.village.cutoff_hour} jam</span>. Mengungsi ke{" "}
                <span className="text-site">{featured.site.facility_name}</span>, {formatKm(featured.site.distance_m)}
                {leave ? <>, berangkat sebelum <span className="whitespace-nowrap">{leave}</span></> : null}.”
              </p>
            ) : (
              <Skeleton className="h-24" />
            )}
          </div>
          <p className="mt-4 text-sm text-ink-2">Satu kalimat yang bisa langsung dijalankan kepala desa, BPBD, dan warga.</p>
        </Reveal>
      </div>
    </section>
  );
}
