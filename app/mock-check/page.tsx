"use client";

import { useEffect, useState } from "react";

// Samakan dengan endpoint di kontrak KON-06
const ENDPOINTS: { method: "GET" | "POST"; path: string }[] = [
  { method: "GET", path: "/api/latest" },
  { method: "GET", path: "/api/runs/run-20261015-0700/roads" },
  { method: "GET", path: "/api/runs/run-20261015-0700/villages" },
  { method: "GET", path: "/api/run/latest" },
  { method: "GET", path: "/api/ruas/status" },
  { method: "GET", path: "/api/desa" },
  { method: "GET", path: "/api/desa/ds-001" },
  { method: "GET", path: "/api/banjir/peluang" },
  { method: "POST", path: "/api/simulasi" },
  { method: "GET", path: "/api/rute" },
  { method: "GET", path: "/api/metrik" },
  { method: "GET", path: "/api/komando" },
  { method: "GET", path: "/api/bukti" },
  { method: "GET", path: "/api/villages/1" },
];

type Hasil = { key: string; status: number | "ERR"; ms: number; body: string };

export default function MockCheck() {
  const [rows, setRows] = useState<Hasil[]>([]);

  useEffect(() => {
    (async () => {
      const out: Hasil[] = [];
      for (const e of ENDPOINTS) {
        const t = performance.now();
        try {
          const r = await fetch(e.path, { method: e.method });
          const text = await r.text();
          out.push({ key: `${e.method} ${e.path}`, status: r.status, ms: Math.round(performance.now() - t), body: text.slice(0, 300) });
        } catch {
          out.push({ key: `${e.method} ${e.path}`, status: "ERR", ms: Math.round(performance.now() - t), body: "request gagal" });
        }
        setRows([...out]);
      }
    })();
  }, []);

  return (
    <main className="p-6 text-sm">
      <h1 className="mb-1 text-lg font-semibold">Cek Mock API</h1>
      <p className="mb-4 text-gray-500">
        Ganti skenario lewat panel MOCK di kiri bawah, halaman ini otomatis memuat ulang.
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="border-b p-2">Endpoint</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">ms</th>
            <th className="border-b p-2">Isi (potongan)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="align-top">
              <td className="border-b p-2 font-mono">{r.key}</td>
              <td className={`border-b p-2 font-semibold ${r.status === 200 ? "text-green-600" : "text-red-600"}`}>
                {r.status}
              </td>
              <td className="border-b p-2">{r.ms}</td>
              <td className="border-b p-2 font-mono text-xs break-all">{r.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}