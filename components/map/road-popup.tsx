import { X } from "lucide-react";
import type { SelectedRoadInfo } from "@/hooks/use-road-layers";
import { RoadStatusLabel } from "@/components/ui/status";
import { formatKm, formatNumber } from "@/lib/format";
import { highwayLabel, isRoadStatusCode } from "@/lib/status";


interface RoadPopupProps {
  road: SelectedRoadInfo;
  sourceLabel: string;
  onClose: () => void;
}

export function RoadPopup({ road, sourceLabel, onClose }: RoadPopupProps) {
  const status = isRoadStatusCode(road.status) ? road.status : 0;
  const kind = highwayLabel(road.highway_type);
  return (
    <div className="w-72 max-w-[calc(100vw-48px)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="label-data">Ruas {formatNumber(road.edge_id)}</p>
          <p className="text-sm font-semibold text-ink">
            {kind}
            {road.is_bridge ? " · jembatan" : ""}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup detail ruas" className="rounded p-1 text-muted hover:bg-surface-2">
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-2">
        <RoadStatusLabel status={status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted">Kedalaman perkiraan</dt>
          <dd className="font-data text-sm font-semibold text-ink">
            {road.depth_cm === null || road.depth_cm <= 0 ? "Kering" : `${formatNumber(road.depth_cm)} cm`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Panjang terlihat</dt>
          <dd className="font-data text-sm font-semibold text-ink">
            {road.length_m === null ? "—" : formatKm(road.length_m)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted">Sumber</dt>
          <dd className="text-ink-2">{sourceLabel} · jaringan jalan OpenStreetMap</dd>
        </div>
      </dl>
    </div>
  );
}
