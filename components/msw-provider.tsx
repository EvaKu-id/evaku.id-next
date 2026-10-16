"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { HttpNetworkFrame } from "msw/experimental";

interface MswProviderProps {
  children: ReactNode;
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
      await worker.start({
        onUnhandledFrame({ frame, defaults }) {
          if (!(frame instanceof HttpNetworkFrame)) return;
          const { pathname } = new URL(frame.data.request.url);
          if (pathname.startsWith("/api")) defaults.error(); // endpoint /api/* tanpa handler langsung ketahuan
        },
      });
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