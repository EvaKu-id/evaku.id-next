import { CloudRain, LifeBuoy, Satellite, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const MOMENTS = [
  { when: "H−3", title: "Prakiraan", icon: CloudRain, body: "Desa diberi peluang banjir 24, 48, dan 72 jam. Posko tahu desa mana yang akan terputus dan kapan." },
  { when: "H−1", title: "Evakuasi", icon: LifeBuoy, body: "Desa berpeluang tinggi mendapat tiga lokasi aman terdekat dan jam terakhir untuk berangkat." },
  { when: "H", title: "Radar", icon: Satellite, body: "Citra Sentinel-1 memetakan genangan menembus awan. Status jalan dan desa diperbarui dari kondisi nyata." },
  { when: "H+1", title: "Bantuan", icon: Truck, body: "Ruang komando mengurutkan desa prioritas dan memberi rute darat atau titik turun perahu." },
] as const;

export function FourMoments() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-6 hidden border-t-2 border-dashed border-water-2 md:block" />
      {MOMENTS.map(({ when, title, icon: Icon, body }, index) => (
        <li key={when} className="relative">
          <Reveal delay={index * 0.06} className="flex flex-col items-center text-center">
            <span className="relative z-10 grid size-12 place-items-center rounded-full border-2 border-brand bg-bg font-data text-sm font-bold text-brand">
              {when}
            </span>
            <p className="mt-4 flex items-center gap-2 text-lg font-bold text-ink">
              <Icon className="size-5 text-brand" aria-hidden /> {title}
            </p>
            <p className="mt-2 max-w-64 text-sm leading-relaxed text-ink-2">{body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
