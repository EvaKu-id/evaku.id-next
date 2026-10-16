export interface NavLink {
  href: string;
  label: string;
}

export const SITE_NAV: readonly NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/map", label: "Peta" },
  { href: "/komando", label: "Komando" },
  { href: "/bukti", label: "Bukti" },
  { href: "/about", label: "Tentang" },
];

export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
