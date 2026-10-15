import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Waves,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1F5F9] text-[#0B2A4A]">
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full border border-[#0B2A4A]/5" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-[350px] rounded-full border border-[#0B2A4A]/5" />

        <div className="relative mx-auto grid min-h-[calc(100svh-80px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* Hero Content */}
          <div className="relative z-10 lg:pl-4">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0B2A4A]/15 bg-white/60 px-4 py-2">
              <Waves size={16} />
              <span className="text-xs font-semibold tracking-wide">
                FLOOD MANAGEMENT SYSTEM
              </span>
            </div>

            <h1 className="text-5xl leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="block font-light">
                Get to know
              </span>

              <span className="mt-1 block font-extrabold">
                Evaku
                <span className="font-light">.id</span>
              </span>

              <span className="mt-3 block max-w-xl text-3xl font-medium leading-tight tracking-tight text-[#0B2A4A]/75 sm:text-4xl xl:text-5xl">
                Flood management,
                <br />
                made smarter.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-[#0B2A4A]/65 sm:text-lg sm:leading-8">
              Platform pemantauan banjir untuk membantu memahami
              kondisi wilayah, mengenali potensi risiko, dan
              mendukung pengambilan keputusan evakuasi secara
              lebih terarah.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="#about"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#0B2A4A] px-7 text-sm font-semibold text-[#F1F5F9] transition-all duration-300 hover:bg-[#071B30] hover:shadow-lg hover:shadow-[#0B2A4A]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2A4A]"
              >
                Discover Evaku.id
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <a
                href="#about"
                className="inline-flex h-14 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hover:bg-[#0B2A4A]/5"
              >
                Learn more
                <ArrowDownRight size={17} />
              </a>
            </div>

            {/* Trust Indicator */}
            <div className="mt-12 flex items-center gap-3 border-t border-[#0B2A4A]/10 pt-6">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#0B2A4A]/[0.07]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Informed decisions. Better preparedness.
                </p>
                <p className="mt-1 text-xs text-[#0B2A4A]/55">
                  Supporting flood monitoring and response.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <figure className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-3 rounded-[2rem] border border-[#0B2A4A]/10" />

            <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-[1.5rem] bg-[#0B2A4A] shadow-2xl shadow-[#0B2A4A]/15 sm:aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1400&q=85"
                alt="Kondisi banjir di kawasan perkotaan"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B30]/90 via-[#071B30]/10 to-transparent" />

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071B30]/40 px-3 py-2 text-xs font-medium text-[#F1F5F9] backdrop-blur-md">
                <span className="size-2 rounded-full bg-[#F1F5F9]" />
                Flood Awareness
              </div>

              {/* Image Caption */}
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F1F5F9]/70">
                  Our Purpose
                </p>

                <h2 className="max-w-sm text-2xl font-semibold leading-tight text-[#F1F5F9] sm:text-3xl">
                  Better information for safer communities.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#F1F5F9]/75">
                  Understand the situation. Prepare for the next step.
                </p>
              </figcaption>
            </div>

            {/* Floating Info Card */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-[#0B2A4A]/10 bg-[#F1F5F9] p-4 shadow-xl sm:-left-8 sm:p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#0B2A4A] text-[#F1F5F9]">
                <Waves size={22} />
              </div>

              <div>
                <p className="text-sm font-bold">Flood Monitoring</p>
                <p className="mt-1 text-xs text-[#0B2A4A]/60">
                  Monitor. Understand. Respond.
                </p>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-[#0B2A4A] px-5 py-16 text-[#F1F5F9] sm:px-8 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F1F5F9]/60">
              About Evaku.id
            </p>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Understanding flood risks starts with better information.
            </h2>
          </div>

          <div className="md:pl-8">
            <p className="text-sm leading-7 text-[#F1F5F9]/70 sm:text-base">
              Evaku.id dirancang untuk mendukung pemantauan kondisi
              banjir dan membantu pengguna memahami informasi
              wilayah terdampak sebagai bagian dari kesiapsiagaan
              dan perencanaan respons bencana.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}