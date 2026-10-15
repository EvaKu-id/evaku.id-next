"use client";

import { useTheme } from "next-themes";
import { useMapLibre } from "@/hooks/use-maplibre";
import { useMapMarkers } from "@/hooks/use-map-markers";
import { DEFAULT_VIEW } from "@/lib/map-config";
import type { BasemapTheme, MapMarker, MapViewState } from "@/types/map";

const DEFAULT_CLASS_NAME =
  "mt-8 h-[calc(100dvh-8rem)] w-full overflow-hidden rounded-2xl";

interface MapViewProps {
  initialView?: MapViewState;
  markers?: readonly MapMarker[];
  className?: string;
}

export function MapView({
  initialView = DEFAULT_VIEW,
  markers,
  className = DEFAULT_CLASS_NAME,
}: MapViewProps) {
  const { resolvedTheme } = useTheme();
  const theme: BasemapTheme = resolvedTheme === "dark" ? "dark" : "light";

  const { containerRef, map } = useMapLibre({ initialView, theme });
  useMapMarkers(map, markers);

  return <div ref={containerRef} className={className} />;
}
