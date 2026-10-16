import type { Metadata } from "next";
import { BuktiContent } from "@/components/bukti/bukti-content";

export const metadata: Metadata = {
  title: "Bukti",
  description: "Akurasi peta genangan, prakiraan peluang banjir, dan titik evakuasi EvaKu pada kejadian banjir nyata.",
};

export default function BuktiPage() {
  return (
    <main id="konten">
      <BuktiContent />
    </main>
  );
}
