import Link from "next/link";
import { Map } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";

export const HEADER_HEIGHT = 64;

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 h-16 border-b border-rule bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <BrandMark />
        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <Button asChild size="sm" className="ml-auto hidden sm:inline-flex md:ml-2">
          <Link href="/map">
            <Map /> Buka peta
          </Link>
        </Button>
        <div className="ml-auto sm:ml-0">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
