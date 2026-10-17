import { Truck, ShieldCheck, X } from "lucide-react";
import type { SelectedPlace } from "@/hooks/use-place-layers";
import { facilityLabel } from "@/components/village/evacuation-list";
import { formatDecimal } from "@/lib/format";

// Evacuation sites must sit at least this far above the forecast water level (engine rule).
const SAFETY_MARGIN_M = 1;

interface PlacePopupProps {
  place: SelectedPlace;
  onClose: () => void;
}

export function PlacePopup({ place, onClose }: PlacePopupProps) {
  const hub = place.kind === "hub";
  const Icon = hub ? Truck : ShieldCheck;
  return (
    <div className="w-72 max-w-[calc(100vw-48px)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="label-data flex items-center gap-1.5">
            <Icon className={`size-3.5 ${hub ? "text-ink" : "text-site"}`} aria-hidden />
            {hub ? "Posko logistik" : "Kandidat lokasi evakuasi"}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">{place.name || (hub ? "Posko" : "Lokasi evakuasi")}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Tutup detail titik" className="rounded p-1 text-muted hover:bg-surface-2">
          <X className="size-4" />
        </button>
      </div>
      {hub ? (
        <p className="mt-2 text-xs leading-relaxed text-ink-2">
          Titik awal rute bantuan. Waktu tempuh ke setiap desa dihitung dari posko terdekat yang masih bisa dijangkau.
        </p>
      ) : (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <dt className="text-muted">Jenis</dt>
            <dd className="font-semibold text-ink">{place.type ? facilityLabel(place.type) : "Fasilitas umum"}</dd>
          </div>
          <div>
            <dt className="text-muted">Sumber</dt>
            <dd className="font-semibold text-ink">{place.source === "BPBD" ? "BPBD" : "OpenStreetMap"}</dd>
          </div>
          {place.handM !== null ? (
            <>
              <div>
                <dt className="text-muted">Tinggi di atas sungai</dt>
                <dd className="font-data text-sm font-semibold text-ink">{formatDecimal(place.handM)} m</dd>
              </div>
              <div>
                <dt className="text-muted">Aman sampai air</dt>
                <dd className="font-data text-sm font-semibold text-site">
                  {formatDecimal(Math.max(0, place.handM - SAFETY_MARGIN_M))} m
                </dd>
              </div>
            </>
          ) : null}
          <div className="col-span-2 text-[11px] text-muted">Kandidat lokasi aman berdasarkan model, ikuti arahan BPBD.</div>
        </dl>
      )}
    </div>
  );
}
