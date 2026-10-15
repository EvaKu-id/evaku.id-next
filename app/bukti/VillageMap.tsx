'use client';

import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { VILLAGE_REPLAY_VALIDATION } from './data';
import type { VillageReplayValidation } from './types';

type MapMode = 'h3' | 'hariH';

// Set ke false setelah peta berhasil tampil.
const SHOW_DEBUG = true;

const MAP_CENTER: [number, number] = [100.36, -0.865];

function getMarkerColor(mode: MapMode, village: VillageReplayValidation) {
  if (mode === 'h3') {
    if (village.predH3 === 'terisolasi') return '#e11d48';
    if (village.predH3 === 'waspada') return '#f59e0b';
    return '#059669';
  }

  if (village.actualHariH === 'terisolasi_total') return '#e11d48';
  if (village.actualHariH === 'sebagian') return '#f97316';
  return '#059669';
}

export default function VillageMap({
  mode,
  selectedVillage,
  onSelectVillage,
}: {
  mode: MapMode;
  selectedVillage: VillageReplayValidation;
  onSelectVillage: (village: VillageReplayValidation) => void;
}) {
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

  // 1) Inisialisasi peta.
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
              tiles: [
                'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
        },
        center: MAP_CENTER,
        zoom: 11.5,
        minZoom: 8,
        maxZoom: 19,
      });
    } catch (error) {
      console.error('Gagal membuat peta:', error);
      setFatalError(
        error instanceof Error ? error.message : 'Gagal membuat peta',
      );
      return;
    }

    mapRef.current = map;
    setStatus('dibuat');

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right');

    map.on('error', (event) => {
      console.error('MapLibre error:', event.error);
      setTileErrors((n) => n + 1);
    });
    map.on('style.load', () => setStatus('style dimuat'));
    map.on('load', () => {
      setStatus('siap');
      map.resize();
    });

    // Marker tidak perlu menunggu tile, jadi langsung siap.
    setMapReady(true);

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

  // 2) Marker dibuat saat peta siap atau mode berubah.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    elementsRef.current.clear();

    VILLAGE_REPLAY_VALIDATION.forEach((village) => {
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
        background: ${getMarkerColor(mode, village)};
        color: white;
        font-size: 11px;
        line-height: 1.2;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,.25);
        outline: none;
        outline-offset: 2px;
      `;

      element.addEventListener('click', () => {
        selectRef.current(village);
      });

      const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
        .setLngLat(village.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
      elementsRef.current.set(village.id, element);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      elementsRef.current.clear();
    };
  }, [mode, mapReady]);

  // 3) Update outline desa terpilih tanpa membuat ulang marker.
  useEffect(() => {
    elementsRef.current.forEach((element, id) => {
      const isSelected = id === selectedVillage.id;
      element.style.outline = isSelected ? '3px solid #0f172a' : 'none';
      element.style.zIndex = isSelected ? '10' : '';
    });
  }, [selectedVillage.id, mapReady, mode]);

  return (
    <div
      className="relative w-full bg-slate-100"
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

      <div className="absolute left-3 top-3 z-10 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-md">
        <p className="font-bold text-slate-800">
          {mode === 'h3' ? 'Prediksi Risiko H−3' : 'Status Lapangan Hari H'}
        </p>
        <p className="mt-0.5 text-slate-500">
          {VILLAGE_REPLAY_VALIDATION.length} titik sampel
        </p>
      </div>

      {SHOW_DEBUG && (
        <div className="absolute bottom-3 left-3 z-10 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-white">
          peta: {status} · error: {tileErrors}
        </div>
      )}
    </div>
  );
}