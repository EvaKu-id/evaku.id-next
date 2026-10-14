export const SKENARIO = ["normal", "cadangan", "error", "kosong", "terisolasi"] as const;
export type Skenario = (typeof SKENARIO)[number];

const KEY = "mock:skenario";
let current: Skenario = "normal";

const valid = (v: unknown): v is Skenario => SKENARIO.includes(v as Skenario);

export const getSkenario = () => current;

export function setSkenario(s: Skenario) {
  current = s;
  try {
    sessionStorage.setItem(KEY, s);
  } catch {} 
}

export function initSkenario() {
  try {
    const fromUrl = new URLSearchParams(location.search).get("skenario");
    const stored = sessionStorage.getItem(KEY);
    const pick = [fromUrl, stored].find(valid);
    if (pick) current = pick as Skenario;
    if (valid(fromUrl)) sessionStorage.setItem(KEY, fromUrl);
  } catch {}
}