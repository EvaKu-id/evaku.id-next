"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

interface MswProviderProps {
  children: ReactNode;
}

interface UnhandledRequestPrint {
  error: () => void;
}

// Tidak pernah aktif di production, walau flag-nya bocor
const enabled =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

type MswGlobal = typeof globalThis & {
  __mswStart?: Promise<ComponentType>;
};

// Runs only once, no matter how many times the effect fires
function startMsw(): Promise<ComponentType> {
  const g = globalThis as MswGlobal;
  if (!g.__mswStart) {
    g.__mswStart = (async () => {
      const { worker } = await import("@/mocks/browser");
      const startOptions = {
        onUnhandledRequest(request: Request, print: UnhandledRequestPrint) {
          const { pathname } = new URL(request.url);
          if (!pathname.startsWith("/api")) return;
          print.error(); // endpoint /api/* tanpa handler langsung ketahuan
        },
      };
      await worker.start(
        startOptions as unknown as Parameters<typeof worker.start>[0],
      );
      const panel = await import("@/mocks/scenario-panel");
      return panel.default;
    })();
  }
  return g.__mswStart;
}

export function MswProvider({ children }: MswProviderProps) {
  const [ready, setReady] = useState<boolean>(!enabled);
  const [Panel, setPanel] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let cancelled = false;

    startMsw().then((panel) => {
      if (cancelled) return;
      setPanel(() => panel);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      {children}
      {Panel && <Panel />}
    </>
  );
}