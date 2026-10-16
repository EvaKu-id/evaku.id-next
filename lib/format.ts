const numberFormat = new Intl.NumberFormat("id-ID");
const oneDecimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat("id-ID", { style: "percent", maximumFractionDigits: 0 });

const wibDateTime = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const wibDate = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const wibShortDate = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
});

export function formatNumber(value: number): string {
  return numberFormat.format(Math.round(value));
}

export function formatDecimal(value: number): string {
  return oneDecimal.format(value);
}

const twoDecimals = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatRatio(value: number): string {
  return twoDecimals.format(value);
}

export function formatPercent(value: number): string {
  return percentFormat.format(value);
}

export function formatKm(meters: number): string {
  return `${oneDecimal.format(meters / 1000)} km`;
}

export function formatMeters(value: number): string {
  return `${oneDecimal.format(value)} m`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} mnt`;
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} mnt`;
}

export function formatWib(iso: string | Date): string {
  return `${wibDateTime.format(new Date(iso)).replace(/\./g, ":")} WIB`;
}

export function formatDateLong(iso: string | Date): string {
  return wibDate.format(new Date(iso));
}

export function formatDateShort(iso: string | Date): string {
  return wibShortDate.format(new Date(iso));
}

export function addHours(iso: string, hours: number): Date {
  return new Date(new Date(iso).getTime() + hours * 3_600_000);
}

export function hoursBetween(fromIso: string, to: Date | string): number {
  return Math.round((new Date(to).getTime() - new Date(fromIso).getTime()) / 3_600_000);
}
