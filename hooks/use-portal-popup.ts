"use client";

import { useEffect, useRef, useState } from "react";
import { Popup, type Map as MaplibreMap } from "maplibre-gl";
import type { LngLat } from "@/types/map";

// A MapLibre popup whose body is a DOM node React can portal into, so popups stay anchored to the
// clicked spot while the map pans and zooms. The map canvas is client-only, so `document` exists.
export function usePortalPopup(map: MaplibreMap | null, lngLat: LngLat | null, onClose: () => void): HTMLElement | null {
  const [node] = useState(() => document.createElement("div"));
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!map || !lngLat) return;
    const popup = new Popup({ closeButton: false, closeOnClick: true, maxWidth: "320px", offset: 14, className: "evaku-popup" })
      .setLngLat(lngLat)
      .setDOMContent(node)
      .addTo(map);
    const handleClose = () => onCloseRef.current();
    popup.on("close", handleClose);
    return () => {
      popup.off("close", handleClose);
      popup.remove();
    };
  }, [map, lngLat, node]);

  return map && lngLat ? node : null;
}
