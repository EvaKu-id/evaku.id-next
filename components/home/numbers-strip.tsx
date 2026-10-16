"use client";

import { Stat } from "@/components/ui/stat";
import { useManifest, useNationalFloods } from "@/hooks/use-data";

export function NumbersStrip() {
  const floods = useNationalFloods();
  const manifest = useManifest();
  const region = manifest.data?.region;
  const share = floods.data ? (floods.data.total_floods / floods.data.total_disasters) * 100 : 0;
  return (
    <section aria-label="Angka utama" className="border-b border-rule bg-surface">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <Stat value={floods.data?.total_floods ?? 0} label="kejadian banjir di Indonesia, 2024" source="BNPB" tone="brand" />
        <Stat value={share} unit="%" label="dari seluruh kejadian bencana" source="BNPB, 2024" />
        <Stat value={region?.villages ?? 0} label="desa dipantau di wilayah aktif" source="BPS via OCHA HDX" />
        <Stat value={region?.road_km ?? 0} unit="km" label="jalan dinilai per ruas" source="OpenStreetMap" />
        <Stat value={region?.evacuation_sites ?? 0} label="kandidat lokasi evakuasi" source="OSM, Overture" className="col-span-2 lg:col-span-1" />
      </div>
    </section>
  );
}
