"use client";

import { ChevronDown } from "lucide-react";
import { Accordion } from "radix-ui";

const ITEMS = [
  ["Apakah EvaKu menggantikan peringatan BMKG atau BPBD?", "Tidak. EvaKu melengkapi peringatan resmi dengan informasi akses: jalan mana yang putus, desa mana yang terisolasi, dan ke mana warga bisa mengungsi. Keputusan evakuasi tetap mengikuti arahan BPBD."],
  ["Seberapa sering data diperbarui?", "Prakiraan diperbarui setiap 6 jam. Peta genangan diperbarui setiap kali satelit Sentinel-1 melintas, biasanya setiap beberapa hari dan lebih sering saat kejadian besar."],
  ["Bagaimana wilayah baru ditambahkan?", "Per kabupaten: jaringan jalan, batas desa, warga, dan HAND dibangun dari data terbuka, lalu sungai utamanya dikalibrasi dengan debit. Setelah itu wilayah tampil di peta nasional sebagai wilayah aktif."],
  ["Apakah EvaKu bisa dipakai tanpa login?", "Bisa. Peta, detail desa, ruang komando, dan halaman bukti terbuka untuk umum. Pengaturan ambang dan bobot disimpan di perangkat masing-masing."],
  ["Bagaimana warga menerima peringatan?", "Kepala desa atau warga berlangganan lewat bot Telegram dengan kode desa. Pesan dikirim saat desa berpeluang tinggi banjir atau diperkirakan terputus."],
] as const;

export function Faq() {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-rule rounded-[14px] border border-rule bg-surface">
      {ITEMS.map(([question, answer]) => (
        <Accordion.Item key={question} value={question}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink hover:text-brand">
              {question}
              <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed text-ink-2">{answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
