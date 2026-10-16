'use client';

import { useEffect, useState } from 'react';
import type { VillageReplayValidation } from './types';

export function useVillages() {
  const [villages, setVillages] = useState<VillageReplayValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchVillages() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/villages/1', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil data: HTTP ${response.status}`);
        }

        const data: VillageReplayValidation = await response.json();
        console.log('API status:', response.status);
        console.log('API data:', data);
        setVillages([data]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        setError(
          err instanceof Error ? err.message : 'Terjadi kesalahan.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchVillages();

    return () => controller.abort();
  }, []);

  return { villages, loading, error };
}