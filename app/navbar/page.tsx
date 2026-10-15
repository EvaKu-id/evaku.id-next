"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Waves } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Tentang", href: "#about" },
  { label: "Bukti", href: "/bukti" },
  { label: "Posko Komando", href: "/komando" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Tutup menu dengan tombol Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Tutup menu otomatis saat layar melebar ke desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-5">
      <nav
        aria-label="Navigasi utama"
        className="relative w-full max-w-5xl"
      >
        <div className="flex items-center justify-between gap-3 rounded-full bg-[#0B2A4A]/95 dark:bg-[#071B30]/95 backdrop-blur-md p-2 px-4 shadow-[0_18px_40px_-12px_rgba(7,27,48,0.55)] ring-1 ring-[#071B30]/60 dark:ring-white/10">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-extrabold text-white text-base tracking-tight hover:opacity-90 transition-opacity pl-1"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Waves size={17} />
            </div>
            <span>
              Evaku<span className="font-light text-sky-400">.id</span>
            </span>
          </Link>

          {/* Link desktop */}
          <ul className="hidden items-center md:flex lg:gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[14px] font-medium text-[#F1F5F9]/85 transition-colors duration-200 hover:bg-[#071B30] hover:text-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-[#F1F5F9]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden sm:flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/bukti"
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold px-4 py-2 transition-all shadow-sm hover:shadow-md"
            >
              <Compass size={14} />
              <span>Buka Peta</span>
            </Link>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            {/* Tombol menu mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#071B30] text-[#F1F5F9] transition-colors hover:bg-[#071B30]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1F5F9]"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          id="mobile-menu"
          className={`absolute inset-x-0 top-full mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-3xl bg-[#0B2A4A] shadow-[0_18px_40px_-12px_rgba(7,27,48,0.55)] ring-1 ring-[#071B30]">
            <ul className="flex flex-col p-3 gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#F1F5F9] transition-colors hover:bg-[#071B30] focus-visible:bg-[#071B30] focus-visible:outline-none"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10">
                <Link
                  href="/bukti"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 py-3 text-sm font-bold text-white shadow-md"
                >
                  <Compass size={16} />
                  <span>Buka Peta Interaktif</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}