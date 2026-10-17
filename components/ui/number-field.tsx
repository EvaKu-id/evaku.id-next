interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  suffix: string;
}

export function NumberField({ label, value, onChange, min, max, suffix }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-ink-2">{label}</span>
      <span className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || 0)))}
          className="h-9 w-24 rounded-[8px] border border-rule bg-surface px-2 font-data text-sm text-ink"
        />
        <span className="text-sm text-muted">{suffix}</span>
      </span>
    </label>
  );
}
