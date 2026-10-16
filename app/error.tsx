"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="konten" className="mx-auto grid min-h-[60dvh] max-w-md place-items-center px-4">
      <ErrorState message="Terjadi gangguan saat menampilkan halaman ini." onRetry={reset} className="w-full" />
    </main>
  );
}
