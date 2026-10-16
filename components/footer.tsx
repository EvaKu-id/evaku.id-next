import React from "react";
import Link from "next/link";
import { Waves } from "lucide-react";

export function Footer() {

    return (
        <footer className="bg-[#071B30] text-white border-t border-white/10 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 md:grid-cols-4 pb-12 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="text-2xl font-extrabold font-heading text-white tracking-tight flex items-center gap-2">
                <Waves size={24} className="text-sky-400" />
                Evaku<span className="font-light text-sky-400">.id</span>
              </div>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
                Platform intelijen geospasial dan navigasi evakuasi banjir terpadu
                untuk meningkatkan kesiapsiagaan warga serta koordinasi posko komando bencana.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Semua sistem berjalan normal
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/bukti" className="hover:text-white transition-colors">
                    Simulasi Peta Banjir
                  </Link>
                </li>
                <li>
                  <Link href="/komando" className="hover:text-white transition-colors">
                    Dashboard Posko Komando
                  </Link>
                </li>
                <li>
                  <a href="#how" className="hover:text-white transition-colors">
                    Cara Kerja Sistem
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Tentang Evaku.id
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                Pusat Bantuan
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Kontak Hotline Darurat
                  </a>
                </li>
                <li>
                  <Link href="/bukti" className="hover:text-white transition-colors">
                    Status Isolasi Jalan
                  </Link>
                </li>
                <li>
                  <Link href="/komando" className="hover:text-white transition-colors">
                    Kapasitas Posko Pengungsi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Evaku.id — Sistem Manajemen &amp; Simulasi Evakuasi Banjir.</p>
            <p className="text-slate-400">
              Dibangun untuk keselamatan dan kesiapsiagaan tanggap bencana.
            </p>
          </div>
        </div>
      </footer>
    )
}