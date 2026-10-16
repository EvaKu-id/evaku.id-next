import type React from "react";
import { RoadStatusSwatch } from "@/components/ui/status";
import { PROBABILITY_LABELS, type ProbabilityClass } from "@/lib/forecast";
import { FLOOD_CLASSES, PROBABILITY_COLORS, ROAD_STATUS, VILLAGE_STATUS } from "@/lib/status";
import { PALETTE } from "@/lib/palette";
import type { MapMode } from "@/types/data";
import type { RoadStatusCode } from "@/lib/status";

const ROAD_CODES: readonly RoadStatusCode[] = [0, 1, 2, 3];
const PROB_CLASSES: readonly ProbabilityClass[] = ["low", "mid", "high"];

function Swatch({ color, hatched = false }: { color: string; hatched?: boolean }) {
  return (
    <span
      aria-hidden
      className="size-3 shrink-0 rounded-[3px] border"
      style={{
        backgroundColor: `${color}66`,
        borderColor: color,
        backgroundImage: hatched ? `repeating-linear-gradient(45deg, ${color} 0 1.5px, transparent 1.5px 4px)` : undefined,
      }}
    />
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center gap-2 text-xs text-ink-2">{children}</li>;
}

export function MapLegend({ mode }: { mode: MapMode }) {
  return (
    <div className="space-y-3">
      {mode === "prakiraan" ? (
        <section>
          <h3 className="label-data mb-1.5">Peluang banjir desa</h3>
          <ul className="space-y-1">
            {PROB_CLASSES.map((cls) => (
              <Row key={cls}>
                <Swatch color={PROBABILITY_COLORS[cls]} />
                {PROBABILITY_LABELS[cls]}
                <span className="ml-auto font-data text-muted">
                  {cls === "low" ? "< 35%" : cls === "mid" ? "35–70%" : "≥ 70%"}
                </span>
              </Row>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <h3 className="label-data mb-1.5">Status desa</h3>
          <ul className="space-y-1">
            <Row>
              <Swatch color={VILLAGE_STATUS.fully_isolated.color} hatched />
              {VILLAGE_STATUS.fully_isolated.label}
            </Row>
            <Row>
              <Swatch color={VILLAGE_STATUS.partially_isolated.color} />
              {VILLAGE_STATUS.partially_isolated.label}
            </Row>
          </ul>
        </section>
      )}
      {mode === "radar" ? (
        <section>
          <h3 className="label-data mb-1.5">Kedalaman genangan</h3>
          <ul className="space-y-1">
            {FLOOD_CLASSES.map((item) => (
              <Row key={item.key}>
                <Swatch color={item.color} />
                {item.label}
                <span className="ml-auto font-data text-muted">{item.range}</span>
              </Row>
            ))}
            <Row>
              <span aria-hidden className="h-0 w-3 border-t border-dashed border-ink" />
              Keyakinan rendah (padat bangunan)
            </Row>
          </ul>
        </section>
      ) : null}
      <section>
        <h3 className="label-data mb-1.5">Status jalan</h3>
        <ul className="space-y-1">
          {ROAD_CODES.map((code) => (
            <Row key={code}>
              <RoadStatusSwatch status={code} />
              {ROAD_STATUS[code].label}
            </Row>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="label-data mb-1.5">Titik</h3>
        <ul className="space-y-1">
          <Row>
            <span aria-hidden className="size-3 rounded-full border-2 bg-white" style={{ borderColor: PALETTE.site }} />
            Kandidat lokasi evakuasi
          </Row>
          <Row>
            <span aria-hidden className="size-3 rounded-full border-2 border-white" style={{ backgroundColor: PALETTE.ink }} />
            Posko logistik
          </Row>
          <Row>
            <span aria-hidden className="h-0 w-3 border-t-2 border-dashed" style={{ borderColor: PALETTE.water3 }} />
            Lintasan perahu
          </Row>
        </ul>
      </section>
    </div>
  );
}
