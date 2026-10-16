"use client";

import { useEffect, useState } from "react";
import { villageDetailsSchema, type VillageDetails } from "@/lib/schemas/village";

export function useVillages() {
  const [villages, setVillages] = useState<VillageDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    console.log("[useVillages] Effect dijalankan");

    async function fetchVillages() {
      try {
        console.count("[useVillages] Fetch dikirim");

        const response = await fetch("/api/villages/1", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: HTTP ${response.status}`);
        }
        const data = villageDetailsSchema.parse(await response.json());

        if (controller.signal.aborted) return;

        console.log("[useVillages] Data diterima:", data);

        setVillages([data]);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchVillages();
    return () => {
      console.log("[useVillages] Cleanup");
      controller.abort();
    };
  }, []);

  return { villages, loading, error };
}
