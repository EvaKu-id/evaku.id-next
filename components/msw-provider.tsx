"use client";

import { useEffect, useState, type ReactNode } from "react";

const enabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== "undefined") {
      import("@/mocks/browser")
        .then(({ worker }) =>
          worker.start({
            onUnhandledRequest(request, print) {
              const { pathname } = new URL(request.url);
              if (!pathname.startsWith("/api")) return;
              print.error();
            },
          })
        )
        .then(() => setReady(true));
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}