import { addProtocol, setWorkerUrl } from "maplibre-gl";
import { Protocol } from "pmtiles";

let configured = false;

// MapLibre resolves its worker relative to its own module URL, which breaks once bundled,
// so point it at the worker file emitted as a separate asset. The pmtiles:// protocol is
// registered here too because it must also happen once, before any map loads tiles.
export function ensureMaplibreWorker(): void {
  if (configured) return;
  setWorkerUrl(
    new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href,
  );
  addProtocol("pmtiles", new Protocol().tile);
  configured = true;
}
