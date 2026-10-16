"use client";

import { useEffect, useState } from "react";
import { villageDetailsSchema, type VillageDetails } from "@/lib/schemas/village";

export function useVillages() {
  const [villages, setVillages] = useState<VillageDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchVillages() {
      try {
        const response = await fetch("/api/villages/1", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: HTTP ${response.status}`);
        }
        setVillages([villageDetailsSchema.parse(await response.json())]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchVillages();
    return () => controller.abort();
  }, []);

  return { villages, loading, error };
}
