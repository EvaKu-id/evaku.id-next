"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Ganti tema terang atau gelap"
      title="Ganti tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      Ganti tema
    </button>
  );
}