'use client'; 

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";
import 'maplibre-gl/dist/maplibre-gl.css';

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const protocol = new pmtiles.Protocol();
        maplibregl.addProtocol("pmtiles", protocol.tile);

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://api.protomaps.com/styles/v4/light/en.json?key=YOUR_PROTOMAPS_KEY',
            center: [0, 0],
            zoom: 11,
        });

        map.on('load', () => {});

        return () => {
            maplibregl.removeProtocol("pmtiles");
            map.remove();
        };
    
        return <div ref={mapContainer} className="w-full h-full" />
        ;
    });
}
