 'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { DEFAULT_VIEW } from '@/lib/map-config';
import { ensureMaplibreWorker } from '@/lib/maplibre-worker';
import type { VillageDetails } from '@/lib/schemas/village';

type MapMode = 'h3' | 'hariH';
type Position = [number, number];
const CARTO_API_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY;

const CARTO_RASTER_HOSTS = [
  'https://a.basemaps.cartocdn.com',
  'https://b.basemaps.cartocdn.com',
  'https://c.basemaps.cartocdn.com',
  'https://d.basemaps.cartocdn.com',
];

function getPositions(geom: unknown): Position[] {
  const positions: Position[] = [];

  function traverse(value: unknown): void {
    if (!Array.isArray(value)) return;

    if (
      value.length >= 2 &&
      typeof value[0] === 'number' &&
      typeof value[1] === 'number'
    ) {
      const longitude = value[0];
      const latitude = value[1];

      if (
        Number.isFinite(longitude) &&
        Number.isFinite(latitude) &&
        longitude >= -180 &&
        longitude <= 180 &&
        latitude >= -90 &&
        latitude <= 90
      ) {
        positions.push([longitude, latitude]);
      }

      return;
    }

    value.forEach(traverse);
  }

  traverse(geom);
  return positions;
}

function getVillageCenter(geom: unknown): Position | null {
  const positions = getPositions(geom);

  if (positions.length === 0) return null;

  const longitude =
    positions.reduce((sum, position) => sum + position[0], 0) /
    positions.length;

  const latitude =
    positions.reduce((sum, position) => sum + position[1], 0) /
    positions.length;

  return [longitude, latitude];
}

function canUseWebGL(): boolean {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
}

function getMarkerColor(mode: MapMode): string {
  return mode === 'h3' ? '#2563eb' : '#059669';
}

interface VillageMapProps {
  mode: MapMode;
  villages: VillageDetails[];
  selectedVillage: VillageDetails | null;
  onSelectVillage: (village: VillageDetails) => void;
}

export default function VillageMap({
  mode,
  villages,
  selectedVillage,
  onSelectVillage,
}: VillageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const elementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const selectRef = useRef(onSelectVillage);

  const [mapReady, setMapReady] = useState(false);
  const [fatalError] = useState<string | null>(() =>
    canUseWebGL() ? null : 'Peta membutuhkan WebGL, yang tidak tersedia di browser ini.',
  );

  useEffect(() => {
    selectRef.current = onSelectVillage;
  }, [onSelectVillage]);

  // 1. Inisialisasi peta.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || fatalError) return;

    let map: maplibregl.Map;

    try {
      ensureMaplibreWorker();
      map = new maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: CARTO_RASTER_HOSTS.map(
                (host) =>
                  `${host}/light_all/{z}/{x}/{y}.png${
                    CARTO_API_KEY
                      ? `?key=${encodeURIComponent(CARTO_API_KEY)}`
                      : ''
                  }`,
              ),
              tileSize: 256,
              maxzoom: 19,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [
            {
              id: 'basemap',
              type: 'raster',
              source: 'basemap',
            },
          ],
        },
        center: DEFAULT_VIEW.center,
        zoom: 11,
        minZoom: 2,
        maxZoom: 19,
      });
    } catch (error) {
      console.error('Gagal membuat peta:', error);
      return;
    }

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(
      new maplibregl.ScaleControl({ unit: 'metric' }),
      'bottom-right',
    );

    map.on('error', (event) => {
      console.error('MapLibre error:', event.error);
    });

    map.on('load', () => {
      map.resize();
      setMapReady(true);
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [fatalError]);

  // 2. Buat marker dari data API.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const markers: maplibregl.Marker[] = [];
    const elements = new Map<string, HTMLButtonElement>();
    elementsRef.current = elements;

    villages.forEach((village) => {
      const villageId = String(village.village_id);
      const center = getVillageCenter(village.geom);
      if (!center) return;

      const element = document.createElement('button');
      element.type = 'button';
      element.textContent = village.name;
      element.title = `Lihat detail ${village.name}`;
      element.setAttribute('aria-label', `Pilih desa ${village.name}`);

      element.style.cssText = `
        display: block;
        max-width: 155px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        border: 2px solid white;
        border-radius: 999px;
        padding: 5px 9px;
        background: ${getMarkerColor(mode)};
        color: white;
        font-size: 11px;
        line-height: 1.2;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      `;

      element.addEventListener('click', () => {
        selectRef.current(village);
      });

      const marker = new maplibregl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat(center)
        .addTo(map);

      markers.push(marker);
      elements.set(villageId, element);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      elements.clear();
    };
  }, [villages, mode, mapReady]);

  // 3. Arahkan peta ke desa dari API.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || villages.length === 0) return;

    const firstVillage = villages.find(
      (village) => getVillageCenter(village.geom) !== null,
    );

    const center = firstVillage ? getVillageCenter(firstVillage.geom) : null;
    if (!center) return;

    map.flyTo({
      center,
      zoom: 11.5,
      duration: 1000,
    });
  }, [villages, mapReady]);

  // 4. Tandai marker yang dipilih.
  useEffect(() => {
    const selectedId = selectedVillage
      ? String(selectedVillage.village_id)
      : null;

    elementsRef.current.forEach((element, id) => {
      const isSelected = id === selectedId;

      element.style.outline = isSelected
        ? '3px solid #0f172a'
        : 'none';

      element.style.zIndex = isSelected ? '10' : '';
    });
  }, [selectedVillage, mapReady, mode, villages]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-slate-100"
      style={{ height: 360, minHeight: 360 }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {fatalError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 px-4 text-center text-sm text-rose-600">
          {fatalError}
        </div>
      )}

      {!fatalError && villages.length === 0 && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-4 py-3 text-sm text-slate-600 shadow">
          Belum ada data desa dari API.
        </div>
      )}

      <div className="absolute left-3 top-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-md">
        <p className="font-bold text-slate-800">
          {mode === 'h3' ? 'Prediksi Risiko H−3' : 'Status Lapangan Hari H'}
        </p>
        <p className="mt-0.5 text-slate-500">{villages.length} desa</p>
      </div>
    </div>
  );
}