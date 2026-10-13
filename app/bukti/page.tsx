'use client';
import { useEffect, useRef } from "react";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { tanggal: 'H-3', ketinggian: 10, aktual: 12 },
    { tanggal: 'H-2', ketinggian: 25, aktual: 22 },
    { tanggal: 'H-Hari H', ketinggian: 85, aktual: 80 },
];

export default function BuktiPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Halaman Bukti & Metrik Model</h1>
      <div className="bg-white p-4 rounded-lg shadow border h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="tanggal" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="prediksi" stroke="#3b82f6" name="Prediksi Model" />
            <Line type="monotone" dataKey="aktual" stroke="#ef4444" name="Kondisi Aktual" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    );
}