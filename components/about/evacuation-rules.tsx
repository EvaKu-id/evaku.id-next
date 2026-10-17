import { EVACUATION_RULES as RULES } from "@/lib/content/about";

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
