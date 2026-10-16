import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ui/ornament";

export default function NotFound() {
  return (
    <main id="konten" className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <Ornament name="contours" className="absolute inset-0 text-brand/10" />
      <div className="relative max-w-md text-center">
        <p className="label-data">404</p>
        <h1 className="mt-3 text-h2 text-ink">Halaman ini tidak ditemukan</h1>
        <p className="mt-3 text-ink-2">Mungkin tautannya sudah berubah. Peta dan daftar desa tetap bisa dibuka dari sini.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/map">Buka peta</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Beranda</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
