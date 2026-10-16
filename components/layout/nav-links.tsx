"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/cn";
import { SITE_NAV, isActivePath } from "@/lib/site-nav";

interface NavLinksProps {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}

function NavList({ className, linkClassName, onNavigate, pathname }: NavLinksProps & { pathname: string | null }) {
  return (
    <ul className={className}>
      {SITE_NAV.map((link) => {
        const active = pathname !== null && isActivePath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-[8px] px-3 py-2 text-sm font-semibold text-ink-2 transition-colors hover:text-ink",
                active && "text-ink",
                linkClassName,
              )}
            >
              {link.label}
              {active ? <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" /> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavList(props: NavLinksProps) {
  return <NavList {...props} pathname={usePathname()} />;
}

// Dynamic routes cannot know the pathname while prerendering, so the static list renders first.
export function NavLinks(props: NavLinksProps) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}
