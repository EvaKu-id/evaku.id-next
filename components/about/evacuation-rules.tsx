const RULES = [
  ["≥ L + 1 m", "HAND lokasi minimal satu meter di atas tinggi air prakiraan"],
  ["72 jam", "Tidak tergenang pada horizon prakiraan mana pun"],
  ["≤ 10 km", "Bisa dicapai lewat ruas yang tidak putus"],
  ["4 km/jam", "Waktu jalan kaki; waktu kendaraan dari kecepatan ruas"],
  ["3 lokasi", "Diurutkan dari waktu tempuh tercepat"],
  ["Batas berangkat", "Horizon pertama saat rute ke lokasi itu terputus"],
] as const;

export function EvacuationRules() {
  return (
    <dl className="divide-y divide-rule rounded-[14px] border border-rule bg-surface">
      {RULES.map(([value, label]) => (
        <div key={value} className="grid grid-cols-[120px_1fr] items-center gap-4 px-4 py-3">
          <dt className="font-data text-sm font-semibold text-site">{value}</dt>
          <dd className="text-sm text-ink-2">{label}</dd>
        </div>
      ))}
    </dl>
  );
}
