import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Audience } from "@/components/home/audience";
import { Coverage } from "@/components/home/coverage";
import { FeatureBento } from "@/components/home/feature-bento";
import { FourMoments } from "@/components/home/four-moments";
import { HomeHero } from "@/components/home/home-hero";
import { MessageContrast } from "@/components/home/message-contrast";
import { NumbersStrip } from "@/components/home/numbers-strip";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ui/ornament";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HomePage() {
  return (
    <main id="konten">
      <HomeHero />
      <NumbersStrip />
      <MessageContrast />

      <Section tone="deep" id="fitur" bordered={false}>
        <SectionHeading
         
          label="Fitur"
          title="Semua yang dibutuhkan posko, di satu peta"
          intro="Setiap fitur memakai data wilayah aktif. Pilih kartu untuk langsung membukanya."
        />
        <div className="mt-10">
          <FeatureBento />
        </div>
      </Section>

      <Section id="kronologi">
        <SectionHeading label="Empat momen satu desa" title="Dari tiga hari sebelum banjir sampai bantuan tiba" />
        <div className="mt-12">
          <FourMoments />
        </div>
      </Section>

      <Section tone="surface" id="untuk-siapa">
        <SectionHeading label="Untuk siapa" title="Dibuat untuk orang yang mengambil keputusan di lapangan" />
        <div className="mt-10">
          <Audience />
        </div>
      </Section>

      <Section id="cakupan">
        <SectionHeading label="Cakupan" title="Platform nasional, dibangun wilayah demi wilayah" />
        <div className="mt-10">
          <Coverage />
        </div>
      </Section>

      <section className="relative overflow-hidden border-t border-rule bg-ink text-white">
        <Ornament name="contours" className="absolute inset-0 text-white/[0.07]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6">
          <p className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Keputusan evakuasi tidak perlu menunggu air sampai di depan rumah.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-ink hover:bg-brand-soft">
              <Link href="/map">
                Buka peta <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/komando">Ruang komando</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
