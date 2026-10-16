import Link from "next/link";
import { ArrowRight, ClipboardList, Truck, Users } from "lucide-react";
import { CreditedPhoto } from "@/components/ui/credited-photo";
import { PHOTO_CREDITS } from "@/lib/photo-credits";

const PERSONAS = [
  { icon: ClipboardList, who: "Operator BPBD", need: "Melihat desa yang akan terputus, menjelaskan prioritas, dan menyusun rencana kontinjensi.", href: "/komando", page: "Ruang komando" },
  { icon: Truck, who: "Koordinator logistik", need: "Tidak mengirim truk ke jalan yang putus; tahu rute darat dan titik turun perahu.", href: "/map?mode=radar", page: "Peta radar" },
  { icon: Users, who: "Kepala desa dan warga", need: "Tahu lokasi aman terdekat dan jam terakhir berangkat sebelum jalan tertutup air.", href: "/map?mode=prakiraan&h=72", page: "Peta prakiraan" },
] as const;

export function Audience() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PERSONAS.map(({ icon: Icon, who, need, href, page }, index) => {
        const credit = PHOTO_CREDITS[index];
        return (
          <article key={who} className="flex flex-col overflow-hidden rounded-[16px] border border-rule bg-surface">
            {credit ? <CreditedPhoto credit={credit} sizes="(min-width: 1024px) 33vw, 100vw" className="aspect-[16/10] rounded-none border-0 border-b" /> : null}
            <div className="flex flex-1 flex-col p-5">
              <p className="flex items-center gap-2 font-bold text-ink">
                <Icon className="size-5 text-brand" aria-hidden /> {who}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{need}</p>
              <Link href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                {page} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
