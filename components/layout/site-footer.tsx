import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { SITE_NAV } from "@/lib/site-nav";
import { DATA_SOURCES } from "@/lib/data-sources";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-rule bg-bg-deep">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_0.7fr_1.4fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
            Peringatan akses banjir untuk Indonesia: desa mana yang akan terputus, jalan mana yang masih
            bisa dilewati, dan ke mana warga mengungsi.
          </p>
        </div>
        <div>
          <h2 className="label-data">Halaman</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {SITE_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-2 hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/komando/laporan" className="text-ink-2 hover:text-brand">
                Laporan situasi
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="label-data">Sumber data</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
            {DATA_SOURCES.map((source) => (
              <li key={source.name}>
                {source.attribution}
                <span className="text-muted"> · {source.license}</span>
              </li>
            ))}
          </ul>
          <Link href="/about#kredit-foto" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            Kredit foto
          </Link>
        </div>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 font-data text-xs text-muted sm:px-6">© 2026 EvaKu</p>
      </div>
    </footer>
  );
}
