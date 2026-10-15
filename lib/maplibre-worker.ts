import { setWorkerUrl } from "maplibre-gl";

let configured = false;

// MapLibre resolves its worker relative to its own module URL, which breaks once bundled,
// so point it at the worker file emitted as a separate asset.
export function ensureMaplibreWorker(): void {
  if (configured) return;
  setWorkerUrl(
    new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href,
  );
  configured = true;
}
