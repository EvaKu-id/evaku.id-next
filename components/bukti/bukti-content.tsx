"use client";

import { ComparisonBars } from "@/components/bukti/comparison-bars";
import { MetricCard } from "@/components/bukti/metric-card";
import { ReplayMap } from "@/components/bukti/replay-map";
import { SimulationCurve } from "@/components/bukti/simulation-curve";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ErrorState } from "@/components/ui/error-state";
import { Reveal } from "@/components/ui/reveal";
import { useManifest, useMetrics } from "@/hooks/use-data";
import { formatDateLong, formatPercent, formatRatio } from "@/lib/format";
import { metricNote, metricValue } from "@/lib/metrics";
import { HORIZONS } from "@/lib/forecast";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PALETTE } from "@/lib/palette";

function LeadTimeChart({ values }: { values: { horizon: number; value: number }[] }) {
  return (
    <figure>
      <figcaption className="label-data mb-2">Desa terputus yang sudah diperingatkan sebelumnya</figcaption>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={values} margin={{ top: 20, right: 8, bottom: 4, left: 0 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={PALETTE.rule} strokeDasharray="2 4" />
            <XAxis dataKey="horizon" tickFormatter={(v: number) => `${v} jam sebelum`} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={{ stroke: PALETTE.rule }} tickLine={false} />
            <YAxis domain={[0, 1]} tickFormatter={(v: number) => formatPercent(v)} tick={{ fontSize: 11, fill: PALETTE.muted }} axisLine={false} tickLine={false} width={44} />
            <Tooltip formatter={(v) => [formatPercent(Number(v)), "Tertangkap"]} labelFormatter={(v) => `${v} jam sebelum puncak`} contentStyle={{ borderRadius: 10, border: `1px solid ${PALETTE.rule}`, fontSize: 12 }} cursor={{ fill: PALETTE.brandSoft }} />
            <Bar dataKey="value" fill={PALETTE.brand} radius={[4, 4, 0, 0]} isAnimationActive={false}>
              <LabelList dataKey="value" position="top" formatter={(v) => formatPercent(Number(v))} style={{ fontSize: 12, fill: PALETTE.ink, fontFamily: "var(--font-geist-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

function ratio(value: number | null, fallback: string): string {
  return value === null ? fallback : formatRatio(value);
}

export function BuktiContent() {
  const metrics = useMetrics();
  const manifest = useManifest();
  const m = metrics.data;
  const v = (model: string, name: string) => metricValue(m, model, name);
  const lead = HORIZONS.map((horizon) => ({ horizon, value: v("forecast", `lead_time_hit_${horizon}h`) ?? 0 }));
  const event = manifest.data?.event;

  if (metrics.isError) {
    return (
      <Section>
        <ErrorState message={metrics.error.message} onRetry={() => metrics.refetch()} />
      </Section>
    );
  }

  return (
    <>
      <Section bordered={false} className="pt-10 sm:pt-14">
        <SectionHeading
          as="h1"
          label="Bukti"
          title="Seberapa tepat EvaKu?"
          intro={
            event
              ? `Diuji pada ${event.name}, puncak ${formatDateLong(event.peak_date)}: prakiraan yang terbit tiga hari sebelumnya dibandingkan dengan kondisi yang terlihat radar pada hari H.`
              : "Model diuji pada kejadian banjir nyata dan dataset uji yang tidak dipakai saat pelatihan."
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="IoU peta genangan (U-Net)" value={v("unet", "iou_water")} format="ratio" comparison={`Otsu ${ratio(v("unet", "iou_otsu_baseline"), "—")}`} note={metricNote(m, "unet", "iou_water")} />
          <MetricCard label="PR-AUC peluang banjir" value={v("lgbm", "pr_auc")} format="ratio" comparison={`Ambang hujan 3 hari ${ratio(v("lgbm", "pr_auc_baseline_rain3d"), "—")}`} note={metricNote(m, "lgbm", "pr_auc")} />
          <MetricCard label="Desa terputus diperingatkan H−3" value={v("forecast", "lead_time_hit_72h")} format="percent" note={metricNote(m, "forecast", "lead_time_hit_72h")} />
          <MetricCard label="Lokasi evakuasi tetap kering" value={v("evacuation", "safe_site_rate")} format="percent" note={metricNote(m, "evacuation", "safe_site_rate")} />
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading index="01" label="Genangan radar" title="U-Net membaca air dari citra Sentinel-1" intro="Model dilatih pada Sen1Floods11 berlabel manual dan diuji pada split uji yang tidak pernah dilihat saat pelatihan. Pembandingnya ambang Otsu, cara klasik memisahkan air dari daratan." />
            <div className="mt-8">
              <ComparisonBars
                title="IoU kelas air (makin tinggi makin tepat)"
                items={[
                  { label: "U-Net EvaKu", value: v("unet", "iou_water") ?? 0, emphasis: true },
                  { label: "Ambang Otsu", value: v("unet", "iou_otsu_baseline") ?? 0, emphasis: false },
                ]}
              />
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                {[["Dice", "dice"], ["Presisi", "precision"], ["Recall", "recall"]].map(([label, name]) => (
                  <div key={name} className="rounded-[10px] border border-rule px-3 py-2">
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-data text-lg font-semibold text-ink">{ratio(v("unet", name), "—")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <SectionHeading index="02" label="Prakiraan" title="Peluang banjir mengalahkan ambang hujan" intro="LightGBM memakai hujan, kelembapan tanah, debit sungai, dan topografi. Pembandingnya aturan sederhana: banjir jika hujan tiga hari melewati ambang terbaik." />
            <div className="mt-8 space-y-8">
              <ComparisonBars
                title="PR-AUC pada data uji"
                items={[
                  { label: "LightGBM EvaKu", value: v("lgbm", "pr_auc") ?? 0, emphasis: true },
                  { label: "Hujan 3 hari", value: v("lgbm", "pr_auc_baseline_rain3d") ?? 0, emphasis: false },
                ]}
              />
              <LeadTimeChart values={lead} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading index="03" label="Prediksi vs kenyataan" title="Tiga hari sebelum puncak, desa mana yang sudah ditandai?" />
        <div className="mt-10">
          <ReplayMap />
        </div>
      </Section>

      <Section tone="deep">
        <div className="grid grid-cols-1 [&>*]:min-w-0 gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading index="04" label="Titik evakuasi dan rute" title="Lokasi yang direkomendasikan tetap aman" intro="Setiap kandidat lokasi evakuasi diperiksa terhadap genangan radar hari H, begitu juga rute menuju ke sana." />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <MetricCard label="Lokasi tidak tergenang" value={v("evacuation", "safe_site_rate")} format="percent" />
              <MetricCard label="Rute yang dijanjikan tetap terbuka" value={v("evacuation", "route_open_rate")} format="percent" comparison="Diperiksa pada puncak banjir" />
              <MetricCard label="Presisi status desa" value={v("access", "precision")} format="percent" />
              <MetricCard label="Recall status desa" value={v("access", "recall")} format="percent" />
            </div>
          </div>
          <div className="space-y-8 rounded-[14px] border border-rule bg-surface p-5">
            <p className="label-data">05 — Mesin akses</p>
            <SimulationCurve measure="isolated_villages" title="Desa terisolasi total menurut tinggi air" markers={manifest.data?.forecast_runs} />
            <SimulationCurve measure="cut_road_km" title="Panjang jalan putus menurut tinggi air" />
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted">Simulasi satu skenario</dt>
                <dd className="font-data text-lg font-semibold text-ink">±{Math.round(v("engine", "simulation_ms") ?? 181)} ms</dd>
              </div>
              <div>
                <dt className="text-muted">Satu rute desa</dt>
                <dd className="font-data text-lg font-semibold text-ink">±{Math.round(v("engine", "route_ms") ?? 21)} ms</dd>
              </div>
              <div>
                <dt className="text-muted">Kurva debit R²</dt>
                <dd className="font-data text-lg font-semibold text-ink">{ratio(v("discharge_calibration", "r2"), "—")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading index="06" label="Metodologi" title="Cara pengujian" />
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Pembagian waktu", "Model peluang dilatih sampai 2022, divalidasi 2023, dan diuji 2024–2025. Tidak ada pengacakan data antartahun."],
            ["Kejadian replay", event ? `${event.name}. Prakiraan diambil dari run H−3, kenyataan dari radar hari H.` : "Satu kejadian banjir nyata diputar ulang."],
            ["Genangan", "Sen1Floods11 berlabel manual untuk U-Net; air permanen JRC tidak dihitung sebagai banjir."],
            ["Ambang tinggi", `Kelas "tinggi" dipilih pada peluang ${ratio(v("lgbm", "threshold_high"), "0,70")} supaya peringatan jarang salah.`],
          ].map(([title, body]) => (
            <div key={title} className="border-t-2 border-brand pt-3">
              <dt className="font-semibold text-ink">{title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-2">{body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
