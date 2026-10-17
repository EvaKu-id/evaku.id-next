import { Reveal } from "@/components/ui/reveal";
import { MOMENTS } from "@/lib/content/home";

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
