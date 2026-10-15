"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Bukti", href: "/bukti" },   
  { label: "Komando", href: "/komando" },
  { label: "Map", href: "/map" },
  { label: "Resource", href: "#resource" },
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
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <nav
        aria-label="Navigasi utama"
        className="relative w-full max-w-[calc(100vw-2rem)] md:w-auto"
      >
        <div className="flex items-center justify-between gap-2 rounded-full bg-[#0B2A4A] p-2 shadow-[0_18px_40px_-12px_rgba(7,27,48,0.55)] ring-1 ring-[#071B30] md:justify-start md:gap-3">
          {/* Link desktop */}
          <ul className="hidden items-center md:flex lg:gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2.5 text-[15px] font-medium text-[#F1F5F9]/90 transition-colors duration-200 hover:bg-[#071B30] hover:text-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-[#F1F5F9] lg:px-5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          {/* Tombol menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#071B30] text-[#F1F5F9] transition-colors hover:bg-[#071B30]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1F5F9] md:hidden"
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

        <div
          id="mobile-menu"
          className={`absolute inset-x-0 top-full mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-3xl bg-[#0B2A4A] shadow-[0_18px_40px_-12px_rgba(7,27,48,0.55)] ring-1 ring-[#071B30]">
            <ul className="flex flex-col p-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="block rounded-2xl px-4 py-3.5 text-base font-medium text-[#F1F5F9] transition-colors hover:bg-[#071B30] focus-visible:bg-[#071B30] focus-visible:outline-none"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}