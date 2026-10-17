import { REPLAY_COLORS } from "@/lib/palette";

export const REPLAY_LEGEND = [
  { key: "tp", label: "Tepat: diprediksi dan terjadi", color: REPLAY_COLORS.tp },
  { key: "fp", label: "Alarm palsu: diprediksi, tidak terjadi", color: REPLAY_COLORS.fp },
  { key: "fn", label: "Terlewat: terjadi, tidak diprediksi", color: REPLAY_COLORS.fn },
] as const;
