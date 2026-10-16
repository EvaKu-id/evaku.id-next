import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PhotoCredit } from "@/types/data";

interface CreditedPhotoProps {
  credit: PhotoCredit;
  sizes: string;
  className?: string;
  imageClassName?: string;
  caption?: string;
}

export function CreditedPhoto({ credit, sizes, className, imageClassName, caption }: CreditedPhotoProps) {
  return (
    <figure className={cn("relative overflow-hidden rounded-[14px] border border-rule bg-surface-2", className)}>
      <Image src={credit.file} alt={credit.title} fill sizes={sizes} className={cn("object-cover", imageClassName)} />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-ink/65 px-3 py-2 text-[11px] text-white">
        <span className="min-w-0 truncate">{caption ?? credit.place ?? ""}</span>
        <Link href="/about#kredit-foto" className="max-w-[45%] shrink-0 truncate underline-offset-2 hover:underline">
          Foto: {credit.author}
        </Link>
      </figcaption>
    </figure>
  );
}
