'use client';

import { useEffect, useRef } from 'react';
import {
  Map as MapLibreMap,
  Marker,
  Popup,
  NavigationControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [110.42, -6.97], // [lng, lat]
      zoom: 10,
    });

    map.addControl(new NavigationControl());

    new Marker()
      .setLngLat([110.42, -6.97])
      .setPopup(new Popup().setText('Hello Semarang!'))
      .addTo(map);

    return () => map.remove();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
}