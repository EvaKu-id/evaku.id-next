 'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { VillageReplayValidation } from './types';

type MapMode = 'h3' | 'hariH';
type Position = [number, number];

const SHOW_DEBUG = true;
const MAP_CENTER: Position = [100.36, -0.865];
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

function getMarkerColor(mode: MapMode): string {
  return mode === 'h3' ? '#2563eb' : '#059669';
}

interface VillageMapProps {
  mode: MapMode;
  villages: VillageReplayValidation[];
  selectedVillage: VillageReplayValidation | null;
  onSelectVillage: (village: VillageReplayValidation) => void;
}

export default function VillageMap({
  mode,
  villages,
  selectedVillage,
  onSelectVillage,
}: VillageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const elementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const selectRef = useRef(onSelectVillage);

  const [mapReady, setMapReady] = useState(false);
  const [status, setStatus] = useState('menyiapkan');
  const [tileErrors, setTileErrors] = useState(0);
  const [fatalError, setFatalError] = useState<string | null>(null);

  useEffect(() => {
    selectRef.current = onSelectVillage;
  }, [onSelectVillage]);

  // 1. Inisialisasi peta.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: maplibregl.Map;

    try {
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
        center: MAP_CENTER,
        zoom: 11,
        minZoom: 2,
        maxZoom: 19,
      });
    } catch (error) {
      console.error('Gagal membuat peta:', error);
      setFatalError(
        error instanceof Error ? error.message : 'Gagal membuat peta.',
      );
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
      setTileErrors((count) => count + 1);
    });

    map.on('load', () => {
      setStatus('siap');
      map.resize();
      setMapReady(true);
    });

    setStatus('peta dibuat');

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      elementsRef.current.clear();

      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // 2. Buat marker dari data API.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    elementsRef.current.clear();

    console.log('Data desa diterima VillageMap:', villages);
    console.log('Jumlah desa:', villages.length);

    villages.forEach((village) => {
      const villageId = String(village.village_id);
      const center = getVillageCenter(village.geom);

      if (!center) {
        console.warn(
          `Geom tidak valid untuk desa ${village.name}:`,
          village.geom,
        );
        return;
      }

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

      markersRef.current.push(marker);
      elementsRef.current.set(villageId, element);

      console.log(`Marker desa "${village.name}" pada koordinat:`, center);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      elementsRef.current.clear();
    };
  }, [villages, mode, mapReady]);

  // 3. Arahkan peta ke desa dari API.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || villages.length === 0) return;

    const firstVillage = villages.find(
      (village) => getVillageCenter(village.geom) !== null,
    );

    if (!firstVillage) {
      console.warn('Tidak ada desa dengan koordinat geom yang valid.');
      return;
    }

    const center = getVillageCenter(firstVillage.geom);
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

      {SHOW_DEBUG && (
        <div className="absolute bottom-3 left-3 z-10 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-white">
          peta: {status} · marker: {markersRef.current.length} · error tile: {tileErrors}
        </div>
      )}
    </div>
  );
}