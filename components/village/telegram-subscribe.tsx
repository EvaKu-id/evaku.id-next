"use client";

import { Check, Copy, Send } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PALETTE } from "@/lib/palette";

const BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? "";

export function TelegramSubscribe({ villageId, villageName }: { villageId: string; villageName: string }) {
  const command = `/langganan ${villageId}`;
  const link = BOT ? `https://t.me/${BOT}?start=${villageId}` : null;
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!link) return;
    let cancelled = false;
    QRCode.toString(link, { type: "svg", margin: 0, color: { dark: PALETTE.ink, light: PALETTE.surface } })
      .then((svg) => !cancelled && setQr(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`))
      .catch(() => setQr(null));
    return () => {
      cancelled = true;
    };
  }, [link]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin perintah ini", command);
    }
  }

  return (
    <div id="peringatan" className="rounded-[12px] border border-rule bg-surface p-4">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Send className="size-4 text-brand" aria-hidden /> Peringatan Telegram
          </p>
          <p className="mt-1 text-sm text-ink-2">
            Dapat pesan otomatis saat {villageName} berpeluang tinggi banjir atau diperkirakan terputus.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-rule bg-surface-2 px-3 py-2">
            <code className="flex-1 truncate font-data text-sm text-ink">{command}</code>
            <button type="button" onClick={copy} className="rounded p-1 text-muted hover:text-ink" aria-label="Salin perintah">
              {copied ? <Check className="size-4 text-site" /> : <Copy className="size-4" />}
            </button>
          </div>
          {link ? (
            <Button asChild size="sm" className="mt-3">
              <a href={link} target="_blank" rel="noreferrer">
                <Send /> Buka Telegram
              </a>
            </Button>
          ) : (
            <p className="mt-2 text-xs text-muted">Kirim perintah di atas ke bot EvaKu di Telegram. Kirim /berhenti untuk berhenti.</p>
          )}
        </div>
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element -- generated data URI, nothing for next/image to optimise
          <img src={qr} alt="Kode QR bot Telegram EvaKu" className="hidden size-24 shrink-0 sm:block" />
        ) : null}
      </div>
    </div>
  );
}
