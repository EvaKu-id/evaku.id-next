import { z } from "zod";
import credits from "@/public/photos/credits.json";
import { photoCreditSchema } from "@/lib/data/schemas";
import type { PhotoCredit } from "@/types/data";

export const PHOTO_CREDITS: readonly PhotoCredit[] = z.array(photoCreditSchema).parse(credits);

export function photo(id: string): PhotoCredit | undefined {
  return PHOTO_CREDITS.find((item) => item.id === id);
}
