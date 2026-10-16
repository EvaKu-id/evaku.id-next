"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IndonesiaOutline } from "@/components/home/indonesia-outline";
import { useActiveRegions } from "@/hooks/use-data";
import { formatNumber } from "@/lib/format";

export function Coverage() {
  const regions = useActiveRegions();
  return (
    <div className="grid grid-cols-1 [&>*]:min-w-0 items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-[16px] border border-rule bg-bg-deep p-4 sm:p-6">
        <IndonesiaOutline />
      </div>
      <div className="space-y-4">
        {(regions.data ?? []).map((region) => (
          <div key={region.region_id} className="rounded-[16px] border border-brand/30 bg-brand-soft p-5">
            <p className="label-data text-brand">Wilayah aktif</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-bold text-ink">
              <MapPin className="size-5 text-brand" aria-hidden /> {region.name}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted">Desa</dt>
                <dd className="font-data font-semibold text-ink">{formatNumber(region.villages)}</dd>
              </div>
              <div>
                <dt className="text-muted">Jalan</dt>
                <dd className="font-data font-semibold text-ink">{formatNumber(region.road_km)} km</dd>
              </div>
              <div>
                <dt className="text-muted">Warga</dt>
                <dd className="font-data font-semibold text-ink">{formatNumber(region.population)}</dd>
              </div>
            </dl>
          </div>
        ))}
        <p className="text-sm leading-relaxed text-ink-2">
          Wilayah baru ditambahkan per kabupaten: jaringan jalan, desa, warga, dan ketinggian medan dibangun dari data
          terbuka nasional, lalu sungai utamanya dikalibrasi.
        </p>
        <Button asChild variant="secondary">
          <Link href="/map?scope=national">
            Lihat peta nasional <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
