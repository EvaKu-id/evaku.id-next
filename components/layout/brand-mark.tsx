import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="EvaKu, ke beranda" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image src="/brand/evaku-logo-light.svg" alt="EvaKu" width={111} height={40} className="h-8 w-auto" />
    </Link>
  );
}
