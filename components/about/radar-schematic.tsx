import { FLOOD_CLASSES } from "@/lib/status";
import { PALETTE } from "@/lib/palette";

export function RadarSchematic() {
  return (
    <div className="rounded-[14px] border border-rule bg-surface p-5">
      <ol className="grid gap-3 sm:grid-cols-3">
        <li className="rounded-[10px] bg-surface-2 p-3">
          <p className="label-data">Masukan</p>
          <p className="mt-1 font-data text-sm text-ink">VV · VH · VV−VH</p>
          <p className="mt-1 text-xs text-muted">dB, dipotong dan dinormalisasi</p>
        </li>
        <li className="rounded-[10px] bg-brand-soft p-3">
          <p className="label-data">Model</p>
          <p className="mt-1 text-sm font-semibold text-ink">U-Net ResNet34</p>
          <p className="mt-1 text-xs text-muted">peta peluang air per piksel</p>
        </li>
        <li className="rounded-[10px] bg-surface-2 p-3">
          <p className="label-data">Keluaran</p>
          <ul className="mt-1 space-y-1">
            {FLOOD_CLASSES.map((cls) => (
              <li key={cls.key} className="flex items-center gap-2 text-xs text-ink">
                <span aria-hidden className="size-3 rounded-[3px]" style={{ backgroundColor: cls.color }} />
                {cls.label} <span className="ml-auto font-data text-muted">{cls.range}</span>
              </li>
            ))}
          </ul>
        </li>
      </ol>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-2">
        <span aria-hidden className="h-0 w-6 border-t border-dashed" style={{ borderColor: PALETTE.ink }} />
        Area padat bangunan ditandai keyakinan rendah karena pantulan radar dari atap.
      </p>
    </div>
  );
}
