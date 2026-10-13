'use client';
import { useEffect, useRef, useState } from "react";

interface SimulationSliderProps {
    onSimulate: (value: number) => void;
}

export default function SimulationSlider({ onSimulate }: SimulationSliderProps) {
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const handleScroll = setTimeout(() => {
            onSimulate(height);
        }, 300);

        return () => {
            clearTimeout(handleScroll);
        };
    }, [height, onSimulate]);

    return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">Simulasi Ketinggian Air</label>
        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">
          SIMULASI
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
        className="w-full cursor-pointer accent-blue-600"
      />
      <div className="text-right text-sm font-medium text-gray-600 mt-1">
        {height} meter
      </div>
    </div>
  );
}