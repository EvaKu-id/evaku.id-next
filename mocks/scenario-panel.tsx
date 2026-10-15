"use client";

import { SKENARIO, getSkenario, setSkenario, type Skenario } from "./scenario";

export default function ScenarioPanel() {
  return (
    <label className="fixed bottom-3 left-3 z-9999 rounded-lg border border-yellow-400 bg-yellow-100 px-3 py-2 text-xs text-black shadow">
      MOCK:{" "}
      <select
        defaultValue={getSkenario()}
        onChange={(e) => {
          setSkenario(e.target.value as Skenario);
          location.reload(); // restart data
        }}
      >
        {SKENARIO.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </label>
  );
}